-- Metas por utilizador (ids UUID; compatível com auth.users)
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  category text,
  is_system boolean not null default false,
  is_visible boolean not null default true,
  visible_days text[] not null default array[
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ]::text[],
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.goals is 'Metas do utilizador; visible_days controla dias da semana (chaves em inglês, como no app).';
