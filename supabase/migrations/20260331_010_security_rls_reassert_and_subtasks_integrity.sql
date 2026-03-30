-- Re-assert RLS and per-user policies (safe if 005 already ran).
-- Adds trigger: subtasks.user_id must match goals.user_id for goal_id (prevents cross-tenant links).

alter table public.goals enable row level security;
alter table public.subtasks enable row level security;
alter table public.daily_records enable row level security;
alter table public.user_preferences enable row level security;

-- goals
drop policy if exists "goals_select_own" on public.goals;
create policy "goals_select_own" on public.goals for select using (auth.uid() = user_id);

drop policy if exists "goals_insert_own" on public.goals;
create policy "goals_insert_own" on public.goals for insert with check (auth.uid() = user_id);

drop policy if exists "goals_update_own" on public.goals;
create policy "goals_update_own" on public.goals for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "goals_delete_own" on public.goals;
create policy "goals_delete_own" on public.goals for delete using (auth.uid() = user_id);

-- subtasks
drop policy if exists "subtasks_select_own" on public.subtasks;
create policy "subtasks_select_own" on public.subtasks for select using (auth.uid() = user_id);

drop policy if exists "subtasks_insert_own" on public.subtasks;
create policy "subtasks_insert_own" on public.subtasks for insert with check (auth.uid() = user_id);

drop policy if exists "subtasks_update_own" on public.subtasks;
create policy "subtasks_update_own" on public.subtasks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "subtasks_delete_own" on public.subtasks;
create policy "subtasks_delete_own" on public.subtasks for delete using (auth.uid() = user_id);

-- daily_records
drop policy if exists "daily_records_select_own" on public.daily_records;
create policy "daily_records_select_own" on public.daily_records for select using (auth.uid() = user_id);

drop policy if exists "daily_records_insert_own" on public.daily_records;
create policy "daily_records_insert_own" on public.daily_records for insert with check (auth.uid() = user_id);

drop policy if exists "daily_records_update_own" on public.daily_records;
create policy "daily_records_update_own" on public.daily_records for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "daily_records_delete_own" on public.daily_records;
create policy "daily_records_delete_own" on public.daily_records for delete using (auth.uid() = user_id);

-- user_preferences
drop policy if exists "user_preferences_select_own" on public.user_preferences;
create policy "user_preferences_select_own" on public.user_preferences for select using (auth.uid() = user_id);

drop policy if exists "user_preferences_insert_own" on public.user_preferences;
create policy "user_preferences_insert_own" on public.user_preferences for insert with check (auth.uid() = user_id);

drop policy if exists "user_preferences_update_own" on public.user_preferences;
create policy "user_preferences_update_own" on public.user_preferences for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_preferences_delete_own" on public.user_preferences;
create policy "user_preferences_delete_own" on public.user_preferences for delete using (auth.uid() = user_id);

-- Integrity: subtasks cannot reference another user's goal
create or replace function public.enforce_subtasks_goal_user_match()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.goals g
    where g.id = new.goal_id and g.user_id = new.user_id
  ) then
    raise exception 'subtasks: goal_id must belong to the same user as user_id';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_subtasks_goal_user_match on public.subtasks;
create trigger trg_subtasks_goal_user_match
  before insert or update on public.subtasks
  for each row execute procedure public.enforce_subtasks_goal_user_match();

comment on function public.enforce_subtasks_goal_user_match() is 'Ensures subtasks.goal_id points to a goal owned by subtasks.user_id.';
