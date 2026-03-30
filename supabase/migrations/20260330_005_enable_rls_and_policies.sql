-- Row Level Security: cada utilizador só vê e gere as próprias linhas

alter table public.goals enable row level security;
alter table public.subtasks enable row level security;
alter table public.daily_records enable row level security;
alter table public.user_preferences enable row level security;

-- goals
create policy "goals_select_own"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "goals_insert_own"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "goals_update_own"
  on public.goals for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "goals_delete_own"
  on public.goals for delete
  using (auth.uid() = user_id);

-- subtasks
create policy "subtasks_select_own"
  on public.subtasks for select
  using (auth.uid() = user_id);

create policy "subtasks_insert_own"
  on public.subtasks for insert
  with check (auth.uid() = user_id);

create policy "subtasks_update_own"
  on public.subtasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "subtasks_delete_own"
  on public.subtasks for delete
  using (auth.uid() = user_id);

-- daily_records
create policy "daily_records_select_own"
  on public.daily_records for select
  using (auth.uid() = user_id);

create policy "daily_records_insert_own"
  on public.daily_records for insert
  with check (auth.uid() = user_id);

create policy "daily_records_update_own"
  on public.daily_records for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "daily_records_delete_own"
  on public.daily_records for delete
  using (auth.uid() = user_id);

-- user_preferences
create policy "user_preferences_select_own"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "user_preferences_insert_own"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "user_preferences_update_own"
  on public.user_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_preferences_delete_own"
  on public.user_preferences for delete
  using (auth.uid() = user_id);
