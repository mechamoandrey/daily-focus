-- =============================================================================
-- Reset seguro do schema PUBLIC — apenas objetos da app Daily Focus
-- =============================================================================
--
-- O que este script FAZ:
--   • Remove as tabelas da app (e respetivas policies RLS, triggers e índices).
--   • Remove a função public.set_updated_at() usada pelos triggers de updated_at.
--
-- O que este script NÃO FAZ:
--   • Não altera o schema auth (auth.users, sessões, etc.).
--   • Não apaga utilizadores do Supabase Auth.
--   • Não faz DROP SCHEMA public nem remove outras tabelas que não as listadas.
--
-- Ordem: subtasks antes de goals (FK goal_id → goals.id). CASCADE limpa triggers.
--
-- Depois de executar: reaplicar as migrations do projeto na ordem 001 → 008
-- (SQL Editor ou Supabase CLI, conforme instruções do repositório).
--
-- =============================================================================

begin;

drop table if exists public.subtasks cascade;
drop table if exists public.goals cascade;
drop table if exists public.daily_records cascade;
drop table if exists public.user_preferences cascade;

drop function if exists public.set_updated_at() cascade;

commit;
