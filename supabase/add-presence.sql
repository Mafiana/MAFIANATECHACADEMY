-- Real "Who is online" presence tracking
-- Run this once in the Supabase SQL Editor

create table if not exists public.presence (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'Student',
  page text default 'Portal',
  updated_at timestamptz not null default now()
);

-- Allow any authenticated user to upsert their own row and read everyone
alter table public.presence enable row level security;

drop policy if exists "presence_select" on public.presence;
create policy "presence_select" on public.presence
  for select to authenticated using (true);

drop policy if exists "presence_upsert" on public.presence;
create policy "presence_upsert" on public.presence
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Optional: clean old rows automatically (run periodically or via cron)
-- delete from public.presence where updated_at < now() - interval '10 minutes';
