import { INITIAL_GOALS, cloneGoals } from "@/data/initialGoals";
import { calendarDaysBetween, getLocalDateKey } from "@/lib/date";
import { computeOverallPercent } from "@/lib/progress";

export const STORAGE_KEY = "daily-focus-v1";

const MAX_HISTORY = 21;

function defaultState() {
  const today = getLocalDateKey();
  return {
    goals: cloneGoals(INITIAL_GOALS),
    lastResetDate: today,
    streak: 0,
    history: [],
  };
}

/**
 * Carrega JSON do localStorage ou estado inicial.
 */
export function loadRaw() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function mergeWithInitialShape(parsed) {
  const base = defaultState();
  if (!parsed || typeof parsed !== "object") return base;

  const goals =
    Array.isArray(parsed.goals) && parsed.goals.length
      ? syncGoalsWithInitial(parsed.goals)
      : base.goals;

  return {
    goals,
    lastResetDate:
      typeof parsed.lastResetDate === "string"
        ? parsed.lastResetDate
        : base.lastResetDate,
    streak: typeof parsed.streak === "number" ? parsed.streak : base.streak,
    history: Array.isArray(parsed.history) ? parsed.history : base.history,
  };
}

/** Mantém IDs das metas iniciais; preenche subtarefas novas se o schema evoluir. */
function syncGoalsWithInitial(storedGoals) {
  const byId = Object.fromEntries(storedGoals.map((g) => [g.id, g]));
  return INITIAL_GOALS.map((template) => {
    const existing = byId[template.id];
    if (!existing) return cloneGoals([template])[0];

    const subById = Object.fromEntries(
      (existing.subtasks || []).map((s) => [s.id, s])
    );
    const subtasks = template.subtasks.map((t) => {
      const prev = subById[t.id];
      return {
        ...t,
        done: Boolean(prev?.done),
      };
    });

    return {
      ...template,
      subtasks,
    };
  });
}

/**
 * Se mudou o dia civil, registra o dia anterior no histórico, atualiza streak,
 * zera `done` das subtarefas e fixa lastResetDate em hoje.
 */
export function applyDayResetIfNeeded(state) {
  const today = getLocalDateKey();
  const last = state.lastResetDate;

  if (last === today) return state;

  if (!last) {
    return { ...state, lastResetDate: today };
  }

  let nextStreak = state.streak;
  let history = [...state.history];

  if (last) {
    const gap = calendarDaysBetween(last, today);
    const prevPercent = computeOverallPercent(state.goals);
    const entry = {
      date: last,
      percent: prevPercent,
      complete: prevPercent === 100,
    };

    history = [entry, ...history].filter(
      (h, i, arr) => arr.findIndex((x) => x.date === h.date) === i
    );
    history.sort((a, b) => (a.date < b.date ? 1 : -1));
    history = history.slice(0, MAX_HISTORY);

    if (gap === 1) {
      nextStreak = prevPercent === 100 ? state.streak + 1 : 0;
    } else {
      nextStreak = 0;
    }
  }

  const goals = state.goals.map((g) => ({
    ...g,
    subtasks: g.subtasks.map((s) => ({ ...s, done: false })),
  }));

  return {
    ...state,
    goals,
    lastResetDate: today,
    streak: nextStreak,
    history,
  };
}

export function loadAppState() {
  const merged = mergeWithInitialShape(loadRaw());
  return applyDayResetIfNeeded(merged);
}

export function saveAppState(state) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode */
  }
}
