-- Run once in Supabase SQL Editor.
-- Adds gender for student ID cards, and switches Student ID prefix to SY-.

alter table profiles add column if not exists gender text;
alter table profiles drop constraint if exists profiles_gender_check;
alter table profiles add constraint profiles_gender_check
  check (gender is null or gender in ('Male', 'Female', 'Other'));

-- Prefer SY- prefix for new Student IDs (was S-). Existing codes stay as they are.
do $$
begin
  -- Only change the default if the old S- style is still in place.
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'student_code'
  ) then
    alter table profiles alter column student_code set default ('SY-' || nextval('student_code_seq')::text);
  end if;
exception when others then
  -- sequence may not exist yet on a fresh install; ignore
  null;
end $$;
