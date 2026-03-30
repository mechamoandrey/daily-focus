-- Ensure language column exists (idempotent if 009 was not applied on a given database)
alter table public.user_preferences
  add column if not exists language text;

comment on column public.user_preferences.language is 'UI locale code: pt or en.';
