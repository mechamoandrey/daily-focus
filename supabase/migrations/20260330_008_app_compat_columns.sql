-- Campos de compatibilidade com o modelo da app (metas com chave estável, LinkedIn, histórico rico, migração)

alter table public.goals
  add column if not exists status text not null default 'active';

alter table public.goals
  add column if not exists system_key text;

alter table public.goals
  add column if not exists is_linkedin boolean not null default false;

create unique index if not exists goals_user_system_key_unique
  on public.goals (user_id, system_key)
  where system_key is not null;

alter table public.subtasks
  add column if not exists hint text;

alter table public.subtasks
  add column if not exists external_key text;

alter table public.daily_records
  add column if not exists detail jsonb;

alter table public.user_preferences
  add column if not exists last_reset_date text;

alter table public.user_preferences
  add column if not exists streak integer not null default 0;

alter table public.user_preferences
  add column if not exists migration_completed boolean not null default false;

comment on column public.goals.system_key is 'Chave estável da meta de sistema (ex.: study-english); null para metas criadas pelo utilizador.';
comment on column public.goals.is_linkedin is 'Meta especial LinkedIn (uma por utilizador).';
comment on column public.subtasks.external_key is 'Id lógico da subtarefa quando não é UUID (ex.: study-english-1, li-1).';
comment on column public.daily_records.detail is 'Payload rico do dia (analytics, contagens) — espelho do estado em memória.';
comment on column public.user_preferences.migration_completed is 'true após migração inicial do localStorage ou seed remoto.';
