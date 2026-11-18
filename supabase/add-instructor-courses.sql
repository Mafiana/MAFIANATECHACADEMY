-- Run in Supabase: SQL Editor > New query > paste > Run
-- Lets the admin choose which courses each instructor teaches. An instructor with no courses chosen sees every course.
create table if not exists instructor_courses (
  instructor_id uuid not null references profiles(id) on delete cascade,
  course text not null,
  primary key (instructor_id, course)
);
alter table instructor_courses enable row level security;
drop policy if exists "read own or admin" on instructor_courses;
create policy "read own or admin" on instructor_courses for select using (instructor_id = auth.uid() or is_admin());
drop policy if exists "admins manage instructor courses" on instructor_courses;
create policy "admins manage instructor courses" on instructor_courses for all using (is_admin()) with check (is_admin());
