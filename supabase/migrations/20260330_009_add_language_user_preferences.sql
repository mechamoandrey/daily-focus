-- Preferência de idioma da UI (pt | en)
alter table public.user_preferences
  add column if not exists language text;

comment on column public.user_preferences.language is 'Código de idioma da interface: pt ou en.';
