import { emptyLinkedinFridayFromTemplate } from "@/data/linkedinFriday";
import { addDaysYMD, todayYMD, ymdCompare } from "@/lib/dateUtils";
import { resetGoalsForNewDay, sortGoalsByOrder } from "@/lib/goalModel";
import { buildHistoryDayDetail } from "@/lib/historyDetail";
import { mergeLinkedinStored } from "@/lib/normalizers/linkedinStoredMerge";
import { ensureGoalDomainFields } from "@/lib/normalizers/ensureDomainGoals";
import { computeOverallPercent } from "@/lib/progress";
export { STORAGE_KEY } from "@/lib/storageKeys";
function normalizeGoalsList(goals) {
  const list = Array.isArray(goals) ? goals : [];
  return sortGoalsByOrder(list.map(g => ensureGoalDomainFields(g)));
}
export function applyDailyRollover(state) {
  const today = todayYMD();
  let last = state.lastResetDate || today;
  if (ymdCompare(last, today) >= 0) {
    state.goals = normalizeGoalsList(state.goals);
    state.linkedinFriday = mergeLinkedinStored(state.linkedinFriday);
    if (!state.lastResetDate) state.lastResetDate = today;
    return state;
  }
  let cursor = last;
  let goalsSnapshot = normalizeGoalsList(state.goals);
  let linkedinSnapshot = mergeLinkedinStored(state.linkedinFriday);
  while (ymdCompare(cursor, today) < 0) {
    const percent = ymdCompare(cursor, last) === 0 ? computeOverallPercent(goalsSnapshot, cursor, linkedinSnapshot) : 0;
    appendHistoryForDate(cursor, percent, state, goalsSnapshot, linkedinSnapshot);
    cursor = addDaysYMD(cursor, 1);
    if (ymdCompare(cursor, today) < 0) {
      goalsSnapshot = resetGoalsForNewDay(goalsSnapshot);
      linkedinSnapshot = emptyLinkedinFridayFromTemplate();
    }
  }
  state.goals = resetGoalsForNewDay(normalizeGoalsList(state.goals));
  state.linkedinFriday = emptyLinkedinFridayFromTemplate();
  state.lastResetDate = today;
  return state;
}
function appendHistoryForDate(lastDate, percent, draft, goalsSnapshot, linkedinSnapshot) {
  const completedFullDay = percent === 100;
  const detail = buildHistoryDayDetail(goalsSnapshot, linkedinSnapshot, lastDate);
  const entry = {
    date: lastDate,
    percentComplete: percent,
    completedFullDay,
    detail
  };
  const nextHist = draft.history.filter(h => h.date !== lastDate);
  nextHist.push(entry);
  nextHist.sort((a, b) => ymdCompare(b.date, a.date));
  draft.history = nextHist;
  if (completedFullDay) {
    draft.streak = (draft.streak || 0) + 1;
  } else {
    draft.streak = 0;
  }
}
export function createDefaultState() {
  return {
    lastResetDate: todayYMD(),
    streak: 0,
    history: [],
    goals: [],
    linkedinFriday: emptyLinkedinFridayFromTemplate()
  };
}
export function loadPersistedState() {
  return createDefaultState();
}
export function persistState(_state) {
  void _state;
}
export const loadState = loadPersistedState;
export const saveState = persistState;
