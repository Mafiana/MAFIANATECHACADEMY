-- Run once in Supabase SQL Editor so Access PINs can be saved on each student profile.
alter table profiles add column if not exists access_pin text;
