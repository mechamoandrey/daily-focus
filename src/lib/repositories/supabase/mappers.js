/**
 * Mapeamento DB ↔ modelo em memória (ids UUID vs chaves estáveis).
 */

import { SYSTEM_GOAL_IDS } from "@/lib/goalModel";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * UUID v4 (RFC) — aceita espaços à volta; rejeita null, vazio e strings inválidas.
 * @param {unknown} s
 */
export function isValidUuid(s) {
  if (typeof s !== "string") return false;
  return UUID_RE.test(s.trim());
}

/**
 * Garante que inserts opcionais com `id` nunca enviam null/undefined/inválido
 * (Postgres rejeita NOT NULL em `id` se o cliente serializar null).
 * @param {Record<string, unknown>} row
 */
export function sanitizeOptionalUuidId(row) {
  if (!row || typeof row !== "object") return row;
  if (!("id" in row)) return row;
  const v = row.id;
  if (v == null || typeof v !== "string" || !isValidUuid(v)) {
    delete row.id;
  }
  return row;
}

/**
 * Antes de persistir: metas de sistema mantêm `id` lógico; metas de utilizador
 * precisam de UUID válido para mapear `goal_id` nas subtarefas.
 * @param {unknown[]} goals
 */
export function normalizeGoalsForRemoteInsert(goals) {
  const list = Array.isArray(goals) ? goals : [];
  return list
    .filter((g) => g && typeof g === "object")
    .map((g) => {
      const gid = typeof g.id === "string" ? g.id.trim() : "";
      if (SYSTEM_GOAL_IDS.has(gid)) return g;
      if (isValidUuid(gid)) return g;
      return { ...g, id: crypto.randomUUID() };
    });
}

/**
 * @param {string} appGoalId
 * @param {{ id: string, system_key: string | null, is_linkedin: boolean }[]} goalRows
 */
export function resolveDbGoalUuid(appGoalId, goalRows) {
  const key = typeof appGoalId === "string" ? appGoalId.trim() : "";
  if (SYSTEM_GOAL_IDS.has(key)) {
    const r = goalRows.find(
      (x) => x.system_key === key && !x.is_linkedin
    );
    return r?.id ?? null;
  }
  const r = goalRows.find((x) => x.id === key);
  return r?.id ?? null;
}

/**
 * @param {Record<string, unknown>} st
 */
export function subRowToApp(st) {
  const done = Boolean(st.completed);
  const base = {
    id: st.external_key != null ? String(st.external_key) : String(st.id),
    label: st.label ?? "",
    done,
    completed: done,
    createdAt: st.created_at ?? new Date().toISOString(),
  };
  if (st.hint) base.hint = st.hint;
  return base;
}

/**
 * @param {string} userId
 * @param {string} goalUuid
 * @param {unknown} s
 */
export function appSubtaskToRow(userId, goalUuid, s) {
  const raw = s && typeof s === "object" ? s : {};
  const done = Boolean(
    "completed" in raw ? raw.completed : "done" in raw ? raw.done : false
  );
  const id = typeof raw.id === "string" ? raw.id.trim() : "";
  /** @type {Record<string, unknown>} */
  const row = {
    user_id: userId,
    goal_id: goalUuid,
    label: raw.label ?? "",
    hint: typeof raw.hint === "string" ? raw.hint : null,
    completed: done,
    created_at: raw.createdAt ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  if (isValidUuid(id)) {
    row.id = id;
  } else if (id) {
    row.external_key = id;
  }
  return sanitizeOptionalUuidId(row);
}

/**
 * @param {Record<string, unknown>} row
 * @param {unknown[]} subs
 */
export function dbGoalToApp(row, subs) {
  const list = (subs ?? []).map((x) => subRowToApp(x));
  const appId =
    row.system_key != null && String(row.system_key).length > 0
      ? String(row.system_key)
      : String(row.id);
  return {
    id: appId,
    userId: row.user_id ?? null,
    title: row.title ?? "",
    description: row.description ?? "",
    category: row.category,
    subtasks: list,
    status: row.status ?? "active",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isSystem: Boolean(row.is_system),
    order: row.display_order ?? 0,
    isVisible: row.is_visible !== false,
    visibleDays: Array.isArray(row.visible_days) ? row.visible_days : [],
  };
}
