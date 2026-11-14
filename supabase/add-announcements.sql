-- Optional. Run once in Supabase: SQL Editor > New query > paste > Run.
-- Lets admins post announcements that students see on their portal dashboard.
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
