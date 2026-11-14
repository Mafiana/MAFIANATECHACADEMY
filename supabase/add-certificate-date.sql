-- Optional. Run once in Supabase: SQL Editor > New query > paste > Run.
-- Lets certificates show the date they were issued. The site works without it.
alter table enrollments add column if not exists certificate_issued_at date;
-- Give certificates you already issued a date (today) so they do not show a blank:
update enrollments set certificate_issued_at = current_date where certificate_issued and certificate_issued_at is null;
