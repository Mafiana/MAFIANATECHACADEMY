-- Run once in Supabase: SQL Editor > New query > paste > Run.
-- Adds video lessons and quizzes. Students only see lessons and quizzes for courses they are enrolled in.
-- Quiz answers live in a separate admin-only table, so students cannot read them from the browser.

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
  questions jsonb not null default '[]'::jsonb,  -- [{"q":"Question?","options":["A","B","C"]}]
  created_at timestamptz not null default now()
);

create table if not exists quiz_keys (
  quiz_id bigint primary key references quizzes(id) on delete cascade,
  answers jsonb not null                          -- [0,2,1] = index of the correct option per question
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

create or replace function is_enrolled(c text) returns boolean language sql security definer stable set search_path = public as
$$ select exists (select 1 from enrollments where student_id = auth.uid() and course = c) $$;

drop policy if exists "read lessons" on lessons;
create policy "read lessons" on lessons for select using (is_admin() or is_enrolled(course));
drop policy if exists "admins manage lessons" on lessons;
create policy "admins manage lessons" on lessons for all using (is_admin()) with check (is_admin());

drop policy if exists "read quizzes" on quizzes;
create policy "read quizzes" on quizzes for select using (is_admin() or is_enrolled(course));
drop policy if exists "admins manage quizzes" on quizzes;
create policy "admins manage quizzes" on quizzes for all using (is_admin()) with check (is_admin());

drop policy if exists "admins manage quiz keys" on quiz_keys;
create policy "admins manage quiz keys" on quiz_keys for all using (is_admin()) with check (is_admin());

drop policy if exists "read own attempts" on quiz_attempts;
create policy "read own attempts" on quiz_attempts for select using (student_id = auth.uid() or is_admin());

-- Students submit answers through this function. It marks the quiz on the server and saves the score.
create or replace function submit_quiz(p_quiz bigint, p_answers jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  q_course text; k jsonb; s int := 0; t int; i int;
begin
  if auth.uid() is null then raise exception 'Please log in first'; end if;
  select course into q_course from quizzes where id = p_quiz;
  if q_course is null then raise exception 'Quiz not found'; end if;
  if not (is_admin() or is_enrolled(q_course)) then raise exception 'You are not enrolled in this course'; end if;
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
