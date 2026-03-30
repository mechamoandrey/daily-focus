/** Remote state: load, persist, and initial seed. Supabase is source of truth. */
import {
  LINKEDIN_FRIDAY_META,
  emptyLinkedinFridayFromTemplate,
  INITIAL_LINKEDIN_SUBTASKS,
} from "@/data/linkedinFriday";
import { mergeGoalsWithTemplates, SYSTEM_GOAL_IDS } from "@/lib/goalModel";
import {
  applyDailyRollover,
  createDefaultState,
} from "@/lib/storage";
import {
  appSubtaskToRow,
  dbGoalToApp,
  isValidUuid,
  normalizeGoalsForRemoteInsert,
  resolveDbGoalUuid,
  sanitizeOptionalUuidId,
  subRowToApp,
} from "@/lib/repositories/supabase/mappers";
import {
  deleteDailyRecordsForUser,
  fetchDailyRecordsOrdered,
  insertDailyRecords,
} from "@/lib/repositories/supabase/dailyRecordsRemote";
import {
  countGoalsForUser,
  deleteGoalsForUser,
  fetchGoalsWithSubtasks,
  insertGoals,
  listGoalIdMapRows,
} from "@/lib/repositories/supabase/goalsRemote";
import { fetchUserPreferences, upsertUserPreferences } from "@/lib/repositories/supabase/preferencesRemote";
import { insertSubtasks } from "@/lib/repositories/supabase/subtasksRemote";

export { fetchGoalsWithSubtasks } from "@/lib/repositories/supabase/goalsRemote";

const LINKEDIN_SYSTEM_KEY = LINKEDIN_FRIDAY_META.id;

/**
 * @param {Record<string, unknown> | null} row
 * @param {unknown[]} subs
 */
function buildLinkedinFromRow(row, subs) {
  const base = emptyLinkedinFridayFromTemplate();
  if (!row) return base;
  const visibleDays = Array.isArray(row.visible_days)
    ? row.visible_days
    : ["friday"];
  const mapped = (subs ?? []).map((s) => subRowToApp(s));
  if (mapped.length === 0) {
    return {
      visibleDays,
      subtasks: INITIAL_LINKEDIN_SUBTASKS.map((t) => ({
        id: t.id,
        label: t.label,
        hint: t.hint,
        done: false,
      })),
    };
  }
  return { visibleDays, subtasks: mapped };
}

/**
 * @param {string} userId
 * @param {object} g
 */
function appGoalToInsertRow(userId, g) {
  const now = new Date().toISOString();
  /** @type {Record<string, unknown>} */
  const row = {
    user_id: userId,
    title: g.title ?? "",
    description: g.description ?? "",
    category: g.category ?? null,
    is_system: Boolean(g.isSystem),
    is_visible: g.isVisible !== false,
    visible_days: Array.isArray(g.visibleDays) ? g.visibleDays : [],
    display_order: typeof g.order === "number" ? g.order : 0,
    status: g.status ?? "active",
    is_linkedin: false,
    system_key: null,
    created_at: g.createdAt ?? now,
    updated_at: now,
  };
  const gid = typeof g.id === "string" ? g.id.trim() : "";
  if (SYSTEM_GOAL_IDS.has(gid)) {
    row.system_key = gid;
    row.is_system = true;
  } else {
    row.system_key = null;
    row.is_system = Boolean(g.isSystem);
    if (isValidUuid(gid)) row.id = gid;
  }
  return sanitizeOptionalUuidId(row);
}

/**
 * @param {string} userId
 * @param {ReturnType<typeof createDefaultState>} state
 */
function linkedinGoalInsertRow(userId, state) {
  const li = state.linkedinFriday ?? emptyLinkedinFridayFromTemplate();
  const now = new Date().toISOString();
  return {
    user_id: userId,
    title: LINKEDIN_FRIDAY_META.title,
    description: LINKEDIN_FRIDAY_META.description,
    category: null,
    is_system: true,
    is_visible: true,
    visible_days: li.visibleDays ?? ["friday"],
    display_order: 9999,
    status: "active",
    is_linkedin: true,
    system_key: LINKEDIN_SYSTEM_KEY,
    created_at: now,
    updated_at: now,
  };
}

/**
 * Monta o estado da app a partir das tabelas.
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} userId
 */
export async function assembleStateFromRemote(supabase, userId) {
  const prefs = await fetchUserPreferences(supabase, userId);

  const { goals: goalRows, subtasksByGoal } = await fetchGoalsWithSubtasks(
    supabase,
    userId
  );

  const regular = [];
  let linkedinRow = null;
  let linkedinSubs = [];

  for (const g of goalRows) {
    const subs = subtasksByGoal.get(g.id) ?? [];
    if (g.is_linkedin) {
      linkedinRow = g;
      linkedinSubs = subs;
    } else {
      regular.push(dbGoalToApp(g, subs));
    }
  }

  const mergedGoals = mergeGoalsWithTemplates(regular);

  const linkedinFriday = linkedinRow
    ? buildLinkedinFromRow(linkedinRow, linkedinSubs)
    : emptyLinkedinFridayFromTemplate();

  const records = await fetchDailyRecordsOrdered(supabase, userId);

  const history = records.map((r) => ({
    date: typeof r.date === "string" ? r.date.slice(0, 10) : r.date,
    percentComplete: r.progress ?? 0,
    completedFullDay: Boolean(r.is_perfect_day),
    detail: r.detail ?? undefined,
  }));

  const nextState = {
    lastResetDate: prefs?.last_reset_date ?? undefined,
    streak: typeof prefs?.streak === "number" ? prefs.streak : 0,
    history,
    goals: mergedGoals,
    linkedinFriday,
  };

  const clone = JSON.parse(JSON.stringify(nextState));
  applyDailyRollover(clone);
  return clone;
}

/**
 * Persistência completa no Supabase (fonte de verdade).
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} userId
 * @param {ReturnType<typeof createDefaultState>} state
 */
export async function persistFullStateRemote(supabase, userId, state) {
  await deleteGoalsForUser(supabase, userId);
  await deleteDailyRecordsForUser(supabase, userId);

  const goalsForInsert = normalizeGoalsForRemoteInsert(state.goals ?? []);

  const goalRows = [];
  for (const g of goalsForInsert) {
    goalRows.push(appGoalToInsertRow(userId, g));
  }
  goalRows.push(sanitizeOptionalUuidId(linkedinGoalInsertRow(userId, state)));

  await insertGoals(supabase, goalRows);

  const goalMapRows = await listGoalIdMapRows(supabase, userId);

  const subRows = [];
  for (const g of goalsForInsert) {
    const dbGid = resolveDbGoalUuid(
      typeof g.id === "string" ? g.id : "",
      goalMapRows
    );
    if (!dbGid) continue;
    for (const s of g.subtasks ?? []) {
      subRows.push(appSubtaskToRow(userId, dbGid, s));
    }
  }
  const liUuid = goalMapRows.find((r) => r.is_linkedin)?.id;
  if (liUuid) {
    for (const s of state.linkedinFriday?.subtasks ?? []) {
      subRows.push(appSubtaskToRow(userId, liUuid, s));
    }
  }

  await insertSubtasks(supabase, subRows);

  const dailyRows = (state.history ?? []).map((h) => ({
    user_id: userId,
    date: h.date,
    progress: Math.min(100, Math.max(0, Number(h.percentComplete) || 0)),
    subtasks_completed: h.detail?.subtasksDoneTotal ?? 0,
    subtasks_total: h.detail?.subtasksValidTotal ?? 0,
    is_perfect_day: Boolean(h.completedFullDay),
    goals_snapshot: [],
    detail: h.detail ?? null,
    updated_at: new Date().toISOString(),
  }));
  await insertDailyRecords(supabase, dailyRows);

  const existingPrefs = await fetchUserPreferences(supabase, userId);
  await upsertUserPreferences(supabase, {
    user_id: userId,
    last_reset_date: state.lastResetDate ?? null,
    streak: state.streak ?? 0,
    migration_completed: true,
    language: existingPrefs?.language ?? null,
    updated_at: new Date().toISOString(),
  });
}

/**
 * Metas padrão: cópia por utilizador dos templates + LinkedIn.
 */
export async function seedDefaultUserData(supabase, userId) {
  const next = createDefaultState();
  await persistFullStateRemote(supabase, userId, next);
}

/**
 * Migração localStorage → Supabase desactivada por decisão de produto.
 * Mantido para compatibilidade de imports; nunca importa dados locais para o banco.
 * @returns {Promise<boolean>} sempre false
 */
export async function tryMigrateLocalToRemote(supabase, userId) {
  void supabase;
  void userId;
  return false;
}

/**
 * Carrega remoto; se o utilizador não tiver metas, aplica seed inicial (sem ler localStorage).
 */
export async function loadRemoteUserState(supabase, userId) {
  const n = await countGoalsForUser(supabase, userId);

  if (n === 0) {
    await seedDefaultUserData(supabase, userId);
  }

  return assembleStateFromRemote(supabase, userId);
}
