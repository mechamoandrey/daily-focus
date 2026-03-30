-- Preferências por utilizador (extensível no futuro com colunas adicionais)
create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.user_preferences is 'Uma linha por utilizador; campos extra podem ser adicionados em migrations posteriores.';
