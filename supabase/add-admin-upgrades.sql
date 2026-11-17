-- Run ONCE in Supabase: SQL Editor > New query > paste > Run
-- Adds student profile pictures and a place to store blog images.

alter table profiles add column if not exists avatar_url text;

-- Public buckets (anyone can SEE the pictures; only the server can upload them).
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do update set public = true;
insert into storage.buckets (id, name, public) values ('blog-images', 'blog-images', true) on conflict (id) do update set public = true;

drop policy if exists "public read avatars" on storage.objects;
create policy "public read avatars" on storage.objects for select using (bucket_id = 'avatars');
drop policy if exists "public read blog images" on storage.objects;
create policy "public read blog images" on storage.objects for select using (bucket_id = 'blog-images');
