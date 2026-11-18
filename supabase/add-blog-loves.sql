-- Run ONCE in Supabase: SQL Editor > New query > paste > Run
-- Adds: the "love" (heart) counter on blog posts.

create table if not exists blog_loves (
  slug text primary key,
  loves integer not null default 0 check (loves >= 0),
  updated_at timestamptz not null default now()
);
alter table blog_loves enable row level security;
drop policy if exists "public reads loves" on blog_loves;
create policy "public reads loves" on blog_loves for select using (true);

-- Visitors never write to the table directly. They call this function, which can only add or remove ONE love at a time.
create or replace function love_post(p_slug text, p_delta integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare n integer;
begin
  if p_delta not in (1, -1) or p_slug is null or length(p_slug) = 0 or length(p_slug) > 200 then
    raise exception 'bad input';
  end if;
  insert into blog_loves (slug, loves) values (p_slug, greatest(p_delta, 0))
  on conflict (slug) do update set loves = greatest(blog_loves.loves + p_delta, 0), updated_at = now()
  returning loves into n;
  return n;
end;
$$;
grant select on blog_loves to anon, authenticated;
grant execute on function love_post(text, integer) to anon, authenticated;
