import { mergeGoalsWithTemplates } from "@/lib/goalModel";
import { normalizeHistoryArray } from "@/lib/historyDetail";
import { todayYMD } from "@/lib/dateUtils";
import { mergeLinkedinStored } from "@/lib/normalizers/linkedinStoredMerge";

/**
 * Migra e normaliza o objeto lido do storage para o shape atual + campos de domínio.
 * Metas passam por `mergeGoalsWithTemplates` (inclui `userId` / `goalId` em subtarefas).
 * @param {unknown} parsed
 * @returns {import("@/lib/models/domain.js").DailyFocusPersistedState}
 */
export function migratePersistedState(parsed) {
  const raw = parsed && typeof parsed === "object" ? parsed : {};
  const goals = mergeGoalsWithTemplates(
    Array.isArray(raw.goals) ? raw.goals : []
  );

  const history = normalizeHistoryArray(
    Array.isArray(raw.history) ? raw.history : []
  );

  const preferences =
    raw.preferences && typeof raw.preferences === "object"
      ? migratePreferences(raw.preferences)
      : null;

  return {
    lastResetDate: raw.lastResetDate || todayYMD(),
    streak: typeof raw.streak === "number" ? raw.streak : 0,
    history,
    goals,
    linkedinFriday: mergeLinkedinStored(raw.linkedinFriday),
    ...(preferences ? { preferences } : {}),
  };
}

/**
 * @param {unknown} p
 */
function migratePreferences(p) {
  const o = p && typeof p === "object" ? p : {};
  const now = new Date().toISOString();
  return {
    id: typeof o.id === "string" ? o.id : "local-preferences",
    userId: o.userId ?? null,
    theme: typeof o.theme === "string" ? o.theme : undefined,
    settings:
      o.settings && typeof o.settings === "object" ? o.settings : undefined,
    createdAt: typeof o.createdAt === "string" ? o.createdAt : now,
    updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : now,
  };
}
