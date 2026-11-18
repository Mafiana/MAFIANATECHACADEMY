-- Run in Supabase: SQL Editor > New query > paste > Run
-- Keeps a log of every renewal reminder, so no student is messaged twice for the same step.
create table if not exists renewal_reminders (
  id bigint generated always as identity primary key,
  student_id uuid not null references profiles(id) on delete cascade,
  access_until date not null,                      -- the end date the reminder was about
  stage text not null,                             -- 7d, 3d, 0d, after, or manual
  channel text not null default 'whatsapp',        -- whatsapp (sent automatically) or wa-link (admin opened the chat)
  status text not null default 'sent' check (status in ('sent', 'failed')),
  provider_id text,
  error text,
  created_at timestamptz not null default now()
);
create index if not exists renewal_reminders_student on renewal_reminders (student_id, created_at desc);
-- An automatic step is sent only once per student and end date. Manual sends are not limited.
create unique index if not exists renewal_reminders_once on renewal_reminders (student_id, access_until, stage) where status = 'sent' and stage <> 'manual';

alter table renewal_reminders enable row level security;
drop policy if exists "admins manage reminders" on renewal_reminders;
create policy "admins manage reminders" on renewal_reminders for all using (is_admin()) with check (is_admin());
