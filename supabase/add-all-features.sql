-- Run once in Supabase: SQL Editor > New query > paste > Run.
-- This ONE file adds everything beyond schema.sql: Access PIN accounts, announcements, video lessons, quizzes,
-- lesson progress, certificate numbers and public verification, and instructor accounts.
-- It replaces add-announcements.sql, add-certificate-date.sql and add-lessons-quizzes.sql.
-- Safe to run more than once, and safe if you already ran those older files.

-- ===== Access PIN accounts =====
-- Students and instructors have no email. The admin creates them and gives each an Access PIN. These columns record the
-- plan, how long the PIN works, and whether it is paused. The PIN itself is never stored: only Supabase keeps a hash of it.
alter table profiles add column if not exists phone text;
alter table profiles add column if not exists student_code text;
alter table profiles add column if not exists access_plan text;
alter table profiles add column if not exists access_until date;
alter table profiles add column if not exists access_status text not null default 'active';
alter table profiles drop constraint if exists profiles_access_status_check;
alter table profiles add constraint profiles_access_status_check check (access_status in ('active', 'revoked'));
create sequence if not exists student_code_seq start 1001;
alter table profiles alter column student_code set default ('S-' || nextval('student_code_seq')::text);
update profiles set student_code = 'S-' || nextval('student_code_seq')::text where student_code is null;
create unique index if not exists profiles_student_code_key on profiles (student_code);

-- PIN accounts have a hidden login address, so we do not copy it into the profile.
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name, email, phone)
  values (new.id, new.raw_user_meta_data->>'full_name',
          case when coalesce(new.raw_user_meta_data->>'pin_account', '') = 'true' then null else new.email end,
          new.raw_user_meta_data->>'phone');
  return new;
end $$;

-- ===== Staff (admin or instructor) =====
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check check (role in ('student', 'admin', 'instructor'));

-- A paused instructor loses staff powers immediately, even with a login that is still open.
create or replace function is_staff() returns boolean language sql security definer stable set search_path = public as
$$ select exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'instructor') and access_status = 'active') $$;

drop policy if exists "read own or admin" on profiles;
drop policy if exists "read own or staff" on profiles;
create policy "read own or staff" on profiles for select using (id = auth.uid() or is_staff());
drop policy if exists "admin sets roles" on profiles;
create policy "admin sets roles" on profiles for update using (is_admin()) with check (is_admin());

-- Instructors can read and mark attendance. They cannot see fees or payments (those tables stay admin-only).
drop policy if exists "read own or admin" on attendance;
drop policy if exists "admin writes" on attendance;
drop policy if exists "read own or staff" on attendance;
drop policy if exists "staff write attendance" on attendance;
create policy "read own or staff" on attendance for select using (student_id = auth.uid() or is_staff());
create policy "staff write attendance" on attendance for all using (is_staff()) with check (is_staff());

-- Who is enrolled in which course, WITHOUT the fees. This is what instructors use to build a class register.
create or replace function staff_roster() returns table (student_id uuid, full_name text, email text, course text)
language sql security definer stable set search_path = public as
$$ select e.student_id, p.full_name, p.email, e.course from enrollments e join profiles p on p.id = e.student_id where is_staff() order by p.full_name $$;
revoke all on function staff_roster() from public;
grant execute on function staff_roster() to authenticated;

-- ===== Announcements =====
create table if not exists announcements (
  id bigint generated always as identity primary key,
  title text not null,
  body text not null default '',
  created_at timestamptz not null default now()
);
alter table announcements enable row level security;
drop policy if exists "signed-in users read announcements" on announcements;
create policy "signed-in users read announcements" on announcements for select using (auth.uid() is not null);
drop policy if exists "admins manage announcements" on announcements;
create policy "admins manage announcements" on announcements for all using (is_admin()) with check (is_admin());

-- ===== Video lessons and quizzes =====
create table if not exists lessons (
  id bigint generated always as identity primary key,
  course text not null,
  title text not null,
  video_url text not null,
  minutes int,
  position int not null default 1,
  created_at timestamptz not null default now()
);
create table if not exists quizzes (
  id bigint generated always as identity primary key,
  course text not null,
  title text not null,
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists quiz_keys (
  quiz_id bigint primary key references quizzes(id) on delete cascade,
  answers jsonb not null
);
create table if not exists quiz_attempts (
  id bigint generated always as identity primary key,
  quiz_id bigint not null references quizzes(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  score int not null,
  total int not null,
  created_at timestamptz not null default now()
);
alter table lessons enable row level security;
alter table quizzes enable row level security;
alter table quiz_keys enable row level security;
alter table quiz_attempts enable row level security;

-- Lessons and quizzes need an enrollment AND a PIN that is active and has not ended, so pausing or an end date works at once.
-- A student with no end date is never active.
create or replace function is_enrolled(c text) returns boolean language sql security definer stable set search_path = public as
$$ select exists (
     select 1 from enrollments e join profiles p on p.id = e.student_id
     where e.student_id = auth.uid() and e.course = c and p.access_status = 'active' and p.access_until >= current_date) $$;

drop policy if exists "read lessons" on lessons;
create policy "read lessons" on lessons for select using (is_staff() or is_enrolled(course));
drop policy if exists "admins manage lessons" on lessons;
drop policy if exists "staff manage lessons" on lessons;
create policy "staff manage lessons" on lessons for all using (is_staff()) with check (is_staff());

drop policy if exists "read quizzes" on quizzes;
create policy "read quizzes" on quizzes for select using (is_staff() or is_enrolled(course));
drop policy if exists "admins manage quizzes" on quizzes;
drop policy if exists "staff manage quizzes" on quizzes;
create policy "staff manage quizzes" on quizzes for all using (is_staff()) with check (is_staff());

drop policy if exists "admins manage quiz keys" on quiz_keys;
drop policy if exists "staff manage quiz keys" on quiz_keys;
create policy "staff manage quiz keys" on quiz_keys for all using (is_staff()) with check (is_staff());

drop policy if exists "read own attempts" on quiz_attempts;
create policy "read own attempts" on quiz_attempts for select using (student_id = auth.uid() or is_staff());

create or replace function submit_quiz(p_quiz bigint, p_answers jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  q_course text; k jsonb; s int := 0; t int; i int;
begin
  if auth.uid() is null then raise exception 'Please log in first'; end if;
  select course into q_course from quizzes where id = p_quiz;
  if q_course is null then raise exception 'Quiz not found'; end if;
  if not (is_staff() or is_enrolled(q_course)) then raise exception 'You are not enrolled in this course'; end if;
  select answers into k from quiz_keys where quiz_id = p_quiz;
  if k is null then raise exception 'This quiz has no answer key'; end if;
  if jsonb_typeof(p_answers) <> 'array' then raise exception 'Answers must be a list'; end if;
  t := jsonb_array_length(k);
  for i in 0 .. t - 1 loop
    if jsonb_typeof(p_answers -> i) = 'number' and (p_answers ->> i)::int = (k ->> i)::int then s := s + 1; end if;
  end loop;
  insert into quiz_attempts (quiz_id, student_id, score, total) values (p_quiz, auth.uid(), s, t);
  return jsonb_build_object('score', s, 'total', t, 'key', k);
end $$;
revoke all on function submit_quiz(bigint, jsonb) from public;
grant execute on function submit_quiz(bigint, jsonb) to authenticated;

-- ===== Lesson progress ("Mark as done") =====
create table if not exists lesson_progress (
  student_id uuid not null references profiles(id) on delete cascade,
  lesson_id bigint not null references lessons(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id, lesson_id)
);
alter table lesson_progress enable row level security;
drop policy if exists "read own progress" on lesson_progress;
create policy "read own progress" on lesson_progress for select using (student_id = auth.uid() or is_staff());
drop policy if exists "mark own progress" on lesson_progress;
create policy "mark own progress" on lesson_progress for insert
  with check (student_id = auth.uid() and exists (select 1 from lessons l where l.id = lesson_id and is_enrolled(l.course)));
drop policy if exists "unmark own progress" on lesson_progress;
create policy "unmark own progress" on lesson_progress for delete using (student_id = auth.uid());

-- ===== Certificates: issue date, hard-to-guess number, public verification =====
alter table enrollments add column if not exists certificate_issued_at date;
alter table enrollments add column if not exists certificate_code text;
create unique index if not exists enrollments_certificate_code_key on enrollments (certificate_code);
update enrollments set certificate_issued_at = current_date where certificate_issued and certificate_issued_at is null;
update enrollments set certificate_code = 'MTA-' || upper(substr(md5(random()::text || id::text), 1, 8)) where certificate_issued and certificate_code is null;

-- Anyone (no login) can check a certificate number. It returns only the name, course, class type and date.
create or replace function verify_certificate(p_code text) returns jsonb language sql security definer stable set search_path = public as
$$ select jsonb_build_object('name', coalesce(nullif(p.full_name, ''), 'Student'), 'course', e.course, 'mode', e.mode, 'issued', e.certificate_issued_at)
   from enrollments e join profiles p on p.id = e.student_id
   where e.certificate_issued and e.certificate_code is not null
     and length(coalesce(p_code, '')) between 6 and 40
     and upper(e.certificate_code) = upper(trim(p_code))
   limit 1 $$;
revoke all on function verify_certificate(text) from public;
grant execute on function verify_certificate(text) to anon, authenticated;
