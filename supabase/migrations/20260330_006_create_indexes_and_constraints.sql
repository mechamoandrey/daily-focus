-- Índices para consultas por utilizador e por data

create index if not exists goals_user_id_idx on public.goals (user_id);

create index if not exists subtasks_user_id_idx on public.subtasks (user_id);
create index if not exists subtasks_goal_id_idx on public.subtasks (goal_id);

create index if not exists daily_records_user_id_idx on public.daily_records (user_id);
create index if not exists daily_records_date_idx on public.daily_records (date desc);
create index if not exists daily_records_user_date_idx on public.daily_records (user_id, date desc);

-- user_id já é UNIQUE em user_preferences; índice implícito, opcional explícito:
create index if not exists user_preferences_user_id_idx on public.user_preferences (user_id);
