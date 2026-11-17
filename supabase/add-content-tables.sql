-- Run ONCE in Supabase: SQL Editor > New query > paste > Run
-- (Run add-admin-upgrades.sql first if you have not already.)
-- Adds: public blog posts, public shop products, and saved course progress.

-- ---------- Blog posts ----------
create table if not exists blog_posts (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  category text not null default 'Learning',
  cover text,
  body_html text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table blog_posts enable row level security;
drop policy if exists "public reads published posts" on blog_posts;
create policy "public reads published posts" on blog_posts for select using (published or is_admin());
drop policy if exists "admin writes posts" on blog_posts;
create policy "admin writes posts" on blog_posts for all using (is_admin()) with check (is_admin());

-- ---------- Shop products ----------
create table if not exists shop_products (
  id bigint generated always as identity primary key,
  name text not null,
  cat text not null default 'Mouse',
  price integer not null default 0 check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  descr text not null default '',
  img text,
  imgs jsonb not null default '[]'::jsonb,
  specs jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);
alter table shop_products enable row level security;
drop policy if exists "public reads shop" on shop_products;
create policy "public reads shop" on shop_products for select using (active or is_admin());
drop policy if exists "admin writes shop" on shop_products;
create policy "admin writes shop" on shop_products for all using (is_admin()) with check (is_admin());

insert into storage.buckets (id, name, public) values ('shop-images', 'shop-images', true) on conflict (id) do update set public = true;
drop policy if exists "public read shop images" on storage.objects;
create policy "public read shop images" on storage.objects for select using (bucket_id = 'shop-images');

-- ---------- Interactive course progress (one row per student) ----------
create table if not exists course_progress (
  student_id uuid primary key references profiles(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table course_progress enable row level security;
drop policy if exists "own or staff reads progress" on course_progress;
create policy "own or staff reads progress" on course_progress for select using (student_id = auth.uid() or is_staff());
drop policy if exists "own writes progress" on course_progress;
create policy "own writes progress" on course_progress for insert with check (student_id = auth.uid());
drop policy if exists "own updates progress" on course_progress;
create policy "own updates progress" on course_progress for update using (student_id = auth.uid()) with check (student_id = auth.uid());
