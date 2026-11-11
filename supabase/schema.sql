-- Run in Supabase: SQL Editor > New query > paste > Run
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text, email text,
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz default now()
);
create table enrollments (
  id bigint generated always as identity primary key,
  student_id uuid not null references profiles on delete cascade,
  course text not null, mode text not null default 'physical',
  total_fee integer not null, certificate_issued boolean not null default false,
  created_at timestamptz default now()
);
create table payments (
  id bigint generated always as identity primary key,
  student_id uuid not null references profiles on delete cascade,
  amount integer not null, note text, created_at timestamptz default now()
);
create table attendance (
  id bigint generated always as identity primary key,
  student_id uuid not null references profiles on delete cascade,
  class_date date not null default current_date, present boolean not null default true
);

create function is_admin() returns boolean language sql security definer stable set search_path = public as
$$ select exists (select 1 from profiles where id = auth.uid() and role = 'admin') $$;

create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name, email) values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

alter table profiles enable row level security;
alter table enrollments enable row level security;
alter table payments enable row level security;
alter table attendance enable row level security;

create policy "read own or admin" on profiles for select using (id = auth.uid() or is_admin());
create policy "read own or admin" on enrollments for select using (student_id = auth.uid() or is_admin());
create policy "read own or admin" on payments for select using (student_id = auth.uid() or is_admin());
create policy "read own or admin" on attendance for select using (student_id = auth.uid() or is_admin());
create policy "admin writes" on enrollments for all using (is_admin()) with check (is_admin());
create policy "admin writes" on payments for all using (is_admin()) with check (is_admin());
create policy "admin writes" on attendance for all using (is_admin()) with check (is_admin());

-- After you sign up, make yourself admin (use your email):
-- update profiles set role = 'admin' where email = 'you@example.com';
