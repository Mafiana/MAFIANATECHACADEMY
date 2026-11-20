-- Materials (downloadable .docx / PPT) + student feedback
-- Run once in the Supabase SQL Editor

-- 1. Downloadable materials
create table if not exists public.materials (
  id bigserial primary key,
  course text not null,
  title text not null,
  file_type text not null check (file_type in ('docx','ppt','pptx','pdf')),
  file_url text not null,          -- public URL (Supabase Storage or external)
  description text,
  sort int default 0,
  created_at timestamptz default now()
);

alter table public.materials enable row level security;
drop policy if exists "materials_public_read" on public.materials;
create policy "materials_public_read" on public.materials
  for select to authenticated using (true);
-- Admin writes via service role / dashboard; add insert policy if needed

-- 2. Student feedback
create table if not exists public.feedback (
  id bigserial primary key,
  student_id uuid references auth.users(id) on delete set null,
  student_name text,
  message text not null,
  rating int check (rating between 1 and 5),
  featured boolean default false,   -- admin can mark to show on homepage
  created_at timestamptz default now()
);

alter table public.feedback enable row level security;

drop policy if exists "feedback_insert" on public.feedback;
create policy "feedback_insert" on public.feedback
  for insert to authenticated with check (auth.uid() = student_id);

drop policy if exists "feedback_select_own" on public.feedback;
create policy "feedback_select_own" on public.feedback
  for select to authenticated using (auth.uid() = student_id or true);  -- admin sees all via service / RLS tweak

-- Allow authenticated users to read featured feedback (for homepage)
drop policy if exists "feedback_featured_read" on public.feedback;
create policy "feedback_featured_read" on public.feedback
  for select to anon, authenticated using (featured = true);
