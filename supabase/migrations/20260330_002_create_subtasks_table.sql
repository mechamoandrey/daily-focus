-- Subtarefas ligadas a uma meta (goal_id UUID -> goals.id)
create table if not exists public.subtasks (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.subtasks is 'Checklist por meta; user_id espelha o dono da meta para RLS simples.';
