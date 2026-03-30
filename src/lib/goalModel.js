import { INITIAL_GOALS } from "@/data/initialGoals";
import { ensureGoalDomainFields } from "@/lib/normalizers/ensureDomainGoals";
import {
  ALL_WEEKDAY_KEYS,
  normalizeGoalVisibleDays,
  normalizeLinkedinVisibleDays,
  weekdayKeyFromYmd,
} from "@/lib/visibleDays";

/** @type {Set<string>} */
export const SYSTEM_GOAL_IDS = new Set(INITIAL_GOALS.map((g) => g.id));

const ISO_NOW = () => new Date().toISOString();

/**
 * @param {unknown} s
 * @param {string} [fallbackId]
 */
export function normalizeSubtask(s, fallbackId) {
  const raw = s && typeof s === "object" ? s : {};
  const id =
    typeof raw.id === "string" && raw.id.length > 0
      ? raw.id
      : fallbackId || crypto.randomUUID();
  const done = Boolean(
    "completed" in raw ? raw.completed : "done" in raw ? raw.done : false
  );
  const completed = done;
  const label =
    typeof raw.label === "string" && raw.label.trim().length > 0
      ? raw.label.trim()
      : "Subtarefa";
  const createdAt =
    typeof raw.createdAt === "string" ? raw.createdAt : ISO_NOW();
  const hint = typeof raw.hint === "string" ? raw.hint : undefined;
  return {
    id,
    label,
    done,
    completed,
    createdAt,
    ...(hint !== undefined ? { hint } : {}),
  };
}

/**
 * @param {typeof INITIAL_GOALS[number]} template
 * @param {unknown} stored
 * @param {number} index
 */
export function normalizeSystemGoal(template, stored, index) {
  const prev = stored && typeof stored === "object" ? stored : {};
  const subMap = new Map(
    (Array.isArray(prev.subtasks) ? prev.subtasks : []).map((s) => [
      s.id,
      s,
    ])
  );
  const templateById = new Map(template.subtasks.map((t) => [t.id, t]));
  const prevSubs = Array.isArray(prev.subtasks) ? prev.subtasks : [];

  /** Sem subtarefas salvas: baseline do template + progresso em localStorage. */
  let subtasks;
  if (prevSubs.length === 0) {
    subtasks = template.subtasks.map((t) => {
      const old = subMap.get(t.id);
      return normalizeSubtask(
        {
          ...(old && typeof old === "object" ? old : {}),
          id: t.id,
          label: t.label,
        },
        t.id
      );
    });
  } else {
    /** Saved subtasks exist: preserve order, labels, and removals from user edits. */
    subtasks = prevSubs
      .filter((s) => s && typeof s === "object")
      .map((s) => {
        const old = subMap.get(s.id);
        const tid = templateById.get(s.id);
        const label =
          typeof s.label === "string" && s.label.trim().length > 0
            ? s.label.trim()
            : tid && typeof tid.label === "string"
              ? tid.label
              : "Subtarefa";
        return normalizeSubtask(
          {
            ...(old && typeof old === "object" ? old : {}),
            ...s,
            id: s.id,
            label,
          },
          s.id
        );
      });
  }

  const now = ISO_NOW();
  const title =
    typeof prev.title === "string" && prev.title.trim().length > 0
      ? prev.title.trim()
      : template.title;
  const description =
    typeof prev.description === "string"
      ? prev.description
      : template.description;

  return {
    id: template.id,
    userId: prev.userId ?? null,
    title,
    description,
    category:
      typeof prev.category === "string" && prev.category.trim().length > 0
        ? prev.category.trim()
        : null,
    subtasks,
    status: typeof prev.status === "string" ? prev.status : "active",
    createdAt: typeof prev.createdAt === "string" ? prev.createdAt : now,
    updatedAt: typeof prev.updatedAt === "string" ? prev.updatedAt : now,
    isSystem: true,
    order: typeof prev.order === "number" ? prev.order : index,
    isVisible: prev.isVisible !== false,
    visibleDays: normalizeGoalVisibleDays(prev.visibleDays),
  };
}

/**
 * @param {unknown} raw
 */
export function normalizeUserGoal(raw) {
  const g = raw && typeof raw === "object" ? raw : {};
  const id =
    typeof g.id === "string" && g.id.length > 0 ? g.id : crypto.randomUUID();
  const title =
    typeof g.title === "string" && g.title.trim().length > 0
      ? g.title.trim()
      : "Nova meta";
  const description =
    typeof g.description === "string" ? g.description : "";
  const category =
    typeof g.category === "string" && g.category.trim().length > 0
      ? g.category.trim()
      : null;
  const subs = Array.isArray(g.subtasks) ? g.subtasks : [];
  const subtasks = subs.map((s, i) => normalizeSubtask(s, `sub-${id}-${i}`));
  const now = ISO_NOW();
  return {
    id,
    userId: g.userId ?? null,
    title,
    description,
    category,
    subtasks,
    status: typeof g.status === "string" ? g.status : "active",
    createdAt: typeof g.createdAt === "string" ? g.createdAt : now,
    updatedAt: typeof g.updatedAt === "string" ? g.updatedAt : now,
    isSystem: false,
    order: typeof g.order === "number" ? g.order : 1000,
    isVisible: g.isVisible !== false,
    visibleDays: normalizeGoalVisibleDays(g.visibleDays),
  };
}

/**
 * Metas que entram no dashboard neste dia (arquivo, visibilidade global e dia da semana).
 * @param {unknown[]} goals
 * @param {string} dateYmd
 */
export function filterGoalsForCalendarDay(goals, dateYmd) {
  const base = filterDashboardGoals(goals);
  const key = weekdayKeyFromYmd(dateYmd);
  return base.filter((g) => {
    const days = normalizeGoalVisibleDays(g.visibleDays);
    return days.includes(key);
  });
}

/**
 * Bloco LinkedIn a considerar no progresso neste dia (ou null).
 * @param {unknown} linkedinFriday
 * @param {string} dateYmd
 */
export function linkedinForProgressOnDate(linkedinFriday, dateYmd) {
  const li = linkedinFriday && typeof linkedinFriday === "object" ? linkedinFriday : null;
  if (!li?.subtasks?.length) return null;
  const days = normalizeLinkedinVisibleDays(li.visibleDays);
  const key = weekdayKeyFromYmd(dateYmd);
  return days.includes(key) ? li : null;
}

/**
 * @param {unknown[]} storedGoals
 */
export function mergeGoalsWithTemplates(storedGoals) {
  const list = Array.isArray(storedGoals) ? storedGoals : [];
  const byId = new Map(list.map((g) => [g.id, g]));
  const system = INITIAL_GOALS.map((template, idx) =>
    normalizeSystemGoal(template, byId.get(template.id), idx)
  );
  /** Last occurrence wins — avoids duplicating user goals with the same id. */
  const userById = new Map();
  for (const g of list) {
    if (!g || typeof g !== "object") continue;
    if (SYSTEM_GOAL_IDS.has(g.id)) continue;
    userById.set(g.id, g);
  }
  const user = [...userById.values()].map((g) => normalizeUserGoal(g));
  const merged = [...system, ...user].map((g) => ensureGoalDomainFields(g));
  return sortGoalsByOrder(merged);
}

/**
 * @param {{ order?: number }[]} goals
 */
export function sortGoalsByOrder(goals) {
  return [...goals].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Metas exibidas no dashboard: visíveis e não arquivadas.
 * @param {unknown[]} goals
 */
export function filterDashboardGoals(goals) {
  if (!Array.isArray(goals)) return [];
  return goals.filter((g) => {
    if (!g || typeof g !== "object") return false;
    if (g.isVisible === false) return false;
    if (g.status === "archived") return false;
    return true;
  });
}

/**
 * Zera progresso diário mantendo estrutura (sistema + usuário).
 * @param {unknown[]} goals
 */
export function resetGoalsForNewDay(goals) {
  if (!Array.isArray(goals)) return [];
  return goals.map((g) => {
    const base = g && typeof g === "object" ? g : {};
    const subs = Array.isArray(base.subtasks) ? base.subtasks : [];
    return {
      ...base,
      subtasks: subs.map((s) => {
        const n = normalizeSubtask(s);
        return { ...n, done: false, completed: false };
      }),
    };
  });
}

/**
 * Próximo índice de ordem para nova meta do usuário.
 * @param {unknown[]} goals
 */
export function nextUserGoalOrder(goals) {
  const list = Array.isArray(goals) ? goals : [];
  let max = 999;
  for (const g of list) {
    if (g && typeof g.order === "number" && g.order > max) max = g.order;
  }
  return max + 1;
}

export function emptyUserGoalDraft() {
  const now = ISO_NOW();
  return {
    title: "",
    description: "",
    category: "",
    status: "active",
    isVisible: true,
    allWeekdays: true,
    visibleDays: [...ALL_WEEKDAY_KEYS],
    subtasks: [
      {
        id: crypto.randomUUID(),
        label: "",
        done: false,
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}
