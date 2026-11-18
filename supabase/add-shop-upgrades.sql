-- Run in Supabase: SQL Editor > New query > paste > Run
-- Adds the Featured and New flags to shop products ("Sold out" is automatic when stock is 0).
alter table shop_products add column if not exists featured boolean not null default false;
alter table shop_products add column if not exists is_new boolean not null default false;
