-- Histórico diário agregado (um registo por utilizador e data)
create table if not exists public.daily_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  progress integer not null default 0,
  subtasks_completed integer not null default 0,
  subtasks_total integer not null default 0,
  is_perfect_day boolean not null default false,
  goals_snapshot jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_records_user_date_unique unique (user_id, date),
  constraint daily_records_progress_range check (
    progress >= 0
    and progress <= 100
  ),
  constraint daily_records_subtasks_completed_nonneg check (subtasks_completed >= 0),
  constraint daily_records_subtasks_total_nonneg check (subtasks_total >= 0)
);

comment on table public.daily_records is 'Snapshot opcional do dia em goals_snapshot (jsonb).';
