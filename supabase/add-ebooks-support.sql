-- Ebooks (shown on homepage + managed in Admin)
create table if not exists public.ebooks (
  id          bigserial primary key,
  title       text not null,
  author      text default '',
  description text default '',
  cover_url   text default '',
  file_url    text not null,
  category    text default 'General',
  active      boolean default true,
  featured    boolean default false,
  sort        int default 0,
  created_at  timestamptz default now()
);

alter table public.ebooks enable row level security;

create policy "Public can read active ebooks"
  on public.ebooks for select
  using (active = true);

create policy "Admins full access to ebooks"
  on public.ebooks for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Customer support tickets
create table if not exists public.support_tickets (
  id           bigserial primary key,
  student_id   uuid references public.profiles(id) on delete set null,
  student_name text,
  subject      text not null,
  message      text not null,
  status       text default 'open',
  admin_reply  text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.support_tickets enable row level security;

create policy "Students can insert own tickets"
  on public.support_tickets for insert
  with check (auth.uid() = student_id);

create policy "Students can read own tickets"
  on public.support_tickets for select
  using (auth.uid() = student_id);

create policy "Admins full access to tickets"
  on public.support_tickets for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
