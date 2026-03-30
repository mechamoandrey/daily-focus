-- Mantém updated_at em cada UPDATE

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_goals_updated_at on public.goals;
create trigger set_goals_updated_at
  before update on public.goals
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_subtasks_updated_at on public.subtasks;
create trigger set_subtasks_updated_at
  before update on public.subtasks
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_daily_records_updated_at on public.daily_records;
create trigger set_daily_records_updated_at
  before update on public.daily_records
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_user_preferences_updated_at on public.user_preferences;
create trigger set_user_preferences_updated_at
  before update on public.user_preferences
  for each row
  execute function public.set_updated_at();
