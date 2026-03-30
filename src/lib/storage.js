import { emptyLinkedinFridayFromTemplate } from "@/data/linkedinFriday";
import { addDaysYMD, todayYMD, ymdCompare } from "@/lib/dateUtils";
import {
  mergeGoalsWithTemplates,
  resetGoalsForNewDay,
} from "@/lib/goalModel";
import { buildHistoryDayDetail } from "@/lib/historyDetail";
import { mergeLinkedinStored } from "@/lib/normalizers/linkedinStoredMerge";
import { computeOverallPercent } from "@/lib/progress";

export { STORAGE_KEY } from "@/lib/storageKeys";

/** @typedef {{ date: string, percentComplete: number, completedFullDay: boolean, detail?: object }} HistoryEntry */

/**
 * When the calendar day advances: archive completion for prior day(s), reset subtasks, bump streak rules.
 * @param {{ lastResetDate?: string, streak: number, history: HistoryEntry[], goals: unknown[], linkedinFriday?: unknown }} state
 */
export function applyDailyRollover(state) {
  const today = todayYMD();
  let last = state.lastResetDate || today;

  if (ymdCompare(last, today) >= 0) {
    state.goals = mergeGoalsWithTemplates(state.goals);
    state.linkedinFriday = mergeLinkedinStored(state.linkedinFriday);
    if (!state.lastResetDate) state.lastResetDate = today;
    return state;
  }

  let cursor = last;
  let goalsSnapshot = mergeGoalsWithTemplates(state.goals);
  let linkedinSnapshot = mergeLinkedinStored(state.linkedinFriday);

  while (ymdCompare(cursor, today) < 0) {
    const percent =
      ymdCompare(cursor, last) === 0
        ? computeOverallPercent(goalsSnapshot, cursor, linkedinSnapshot)
        : 0;

    appendHistoryForDate(cursor, percent, state, goalsSnapshot, linkedinSnapshot);

    cursor = addDaysYMD(cursor, 1);
    if (ymdCompare(cursor, today) < 0) {
      goalsSnapshot = resetGoalsForNewDay(goalsSnapshot);
      linkedinSnapshot = emptyLinkedinFridayFromTemplate();
    }
  }

  state.goals = resetGoalsForNewDay(mergeGoalsWithTemplates(state.goals));
  state.linkedinFriday = emptyLinkedinFridayFromTemplate();
  state.lastResetDate = today;
  return state;
}

/**
 * @param {string} lastDate
 * @param {number} percent
 * @param {{ streak: number, history: HistoryEntry[] }} draft
 * @param {unknown[]} goalsSnapshot
 * @param {unknown} linkedinSnapshot
 */
function appendHistoryForDate(lastDate, percent, draft, goalsSnapshot, linkedinSnapshot) {
  const completedFullDay = percent === 100;
  const detail = buildHistoryDayDetail(goalsSnapshot, linkedinSnapshot, lastDate);
  const entry = {
    date: lastDate,
    percentComplete: percent,
    completedFullDay,
    detail,
  };
  const nextHist = draft.history.filter((h) => h.date !== lastDate);
  nextHist.push(entry);
  nextHist.sort((a, b) => ymdCompare(b.date, a.date));
  draft.history = nextHist;

  if (completedFullDay) {
    draft.streak = (draft.streak || 0) + 1;
  } else {
    draft.streak = 0;
  }
}

/** @returns {{ lastResetDate: string, streak: number, history: HistoryEntry[], goals: ReturnType<typeof mergeGoalsWithTemplates>, linkedinFriday: ReturnType<typeof emptyLinkedinFridayFromTemplate> }} */
export function createDefaultState() {
  return {
    lastResetDate: todayYMD(),
    streak: 0,
    history: [],
    goals: mergeGoalsWithTemplates([]),
    linkedinFriday: emptyLinkedinFridayFromTemplate(),
  };
}

/**
 * @deprecated Legacy API. Supabase is the only persisted source; this no longer reads localStorage.
 * @returns {ReturnType<typeof createDefaultState>}
 */
export function loadPersistedState() {
  return createDefaultState();
}

/**
 * @deprecated No-op. Persisted state is written only via Supabase (`persistFullStateRemote`).
 * @param {ReturnType<typeof createDefaultState>} _state
 */
export function persistState(_state) {
  void _state;
}

/** @deprecated Use `loadPersistedState` */
export const loadState = loadPersistedState;

/** @deprecated Use `persistState` */
export const saveState = persistState;
