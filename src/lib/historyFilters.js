import { sortedAsc } from "@/lib/analytics";
import { addDaysYMD, ymdCompare } from "@/lib/dateUtils";
import { normalizeHistoryEntryForRead } from "@/lib/historyDetail";
export const PERIOD_ALL = "all";
export const PERIOD_7 = "7";
export const PERIOD_14 = "14";
export const PERIOD_30 = "30";
export const PERIOD_90 = "90";
export const PERIOD_OPTIONS = [{
  value: PERIOD_7,
  label: "7 dias"
}, {
  value: PERIOD_14,
  label: "14 dias"
}, {
  value: PERIOD_30,
  label: "30 dias"
}, {
  value: PERIOD_90,
  label: "90 dias"
}, {
  value: PERIOD_ALL,
  label: "Tudo"
}];
export function sliceHistoryByPeriod(history, period) {
  if (!Array.isArray(history) || history.length === 0) return [];
  const asc = sortedAsc(history);
  if (period === PERIOD_ALL) return asc;
  const n = Number(period);
  if (!Number.isFinite(n) || n <= 0) return asc;
  const maxDate = asc[asc.length - 1].date;
  const start = addDaysYMD(maxDate, -(n - 1));
  return asc.filter(e => ymdCompare(e.date, start) >= 0 && ymdCompare(e.date, maxDate) <= 0);
}
export function filterHistoryByGoal(history, goalId) {
  if (!goalId || goalId === "all") return history;
  const want = String(goalId).trim();
  return history.filter(e => {
    const norm = normalizeHistoryEntryForRead(e);
    const goals = norm?.detail?.goals;
    if (!Array.isArray(goals) || goals.length === 0) return false;
    return goals.some(g => g && String(g.id).trim() === want);
  });
}
export function applyHistoryFilters(history, filters) {
  const periodSlice = sliceHistoryByPeriod(history, filters.period);
  return filterHistoryByGoal(periodSlice, filters.goalId);
}
