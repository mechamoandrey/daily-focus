import { LINKEDIN_FRIDAY_META } from "@/data/linkedinFriday";
import {
  filterGoalsForCalendarDay,
  linkedinForProgressOnDate,
} from "@/lib/goalModel";
import { computeGoalPercent } from "@/lib/progress";
import { weekdayKeyFromYmd } from "@/lib/visibleDays";

/**
 * Snapshot enriquecido de um dia para persistência em `history[].detail`.
 * @param {unknown[]} goalsSnapshot
 * @param {unknown} linkedinSnapshot
 * @param {string} dateYmd
 */
export function buildHistoryDayDetail(goalsSnapshot, linkedinSnapshot, dateYmd) {
  const visibleGoals = filterGoalsForCalendarDay(goalsSnapshot, dateYmd);
  const li = linkedinForProgressOnDate(linkedinSnapshot, dateYmd);
  const goals = [];
  let subtasksDoneTotal = 0;
  let subtasksValidTotal = 0;

  for (const g of visibleGoals) {
    const subs = Array.isArray(g.subtasks) ? g.subtasks : [];
    const done = subs.filter((s) => s.done).length;
    const total = subs.length;
    subtasksDoneTotal += done;
    subtasksValidTotal += total;
    goals.push({
      id: g.id,
      title: typeof g.title === "string" ? g.title : "",
      isSystem: Boolean(g.isSystem),
      isLinkedin: false,
      goalPercent: computeGoalPercent(g),
      completed: total > 0 && done === total,
      subtasksDone: done,
      subtasksTotal: total,
      subtasksCompletedLabels: subs.filter((s) => s.done).map((s) => s.label),
      subtasksPendingLabels: subs.filter((s) => !s.done).map((s) => s.label),
    });
  }

  if (li) {
    const subs = li.subtasks || [];
    const done = subs.filter((s) => s.done).length;
    const total = subs.length;
    subtasksDoneTotal += done;
    subtasksValidTotal += total;
    goals.push({
      id: LINKEDIN_FRIDAY_META.id,
      title: LINKEDIN_FRIDAY_META.title,
      isSystem: false,
      isLinkedin: true,
      goalPercent: computeGoalPercent(li),
      completed: total > 0 && done === total,
      subtasksDone: done,
      subtasksTotal: total,
      subtasksCompletedLabels: subs.filter((s) => s.done).map((s) => s.label),
      subtasksPendingLabels: subs.filter((s) => !s.done).map((s) => s.label),
    });
  }

  return {
    version: 2,
    dateYmd,
    weekdayKey: weekdayKeyFromYmd(dateYmd),
    conditionalVisibility: true,
    visibleGoalsCount: goals.length,
    subtasksDoneTotal,
    subtasksValidTotal,
    goalsCompleteCount: goals.filter((x) => x.completed).length,
    goalsTotalCount: goals.length,
    goals,
  };
}

/**
 * Normaliza um registo ao ler do storage (compatível com entradas antigas sem `detail`).
 * @param {unknown} h
 */
export function normalizeHistoryEntryForRead(h) {
  if (!h || typeof h !== "object") return null;
  const date = typeof h.date === "string" ? h.date : "";
  if (!date) return null;
  const percentComplete =
    typeof h.percentComplete === "number" ? h.percentComplete : 0;
  const completedFullDay = Boolean(h.completedFullDay);
  const detailRaw = h.detail;
  if (detailRaw && typeof detailRaw === "object" && detailRaw.version >= 2) {
    return {
      date,
      percentComplete,
      completedFullDay,
      detail: detailRaw,
    };
  }
  if (
    detailRaw &&
    typeof detailRaw === "object" &&
    Array.isArray(detailRaw.goals)
  ) {
    return {
      date,
      percentComplete,
      completedFullDay,
      detail: detailRaw,
    };
  }
  return {
    date,
    percentComplete,
    completedFullDay,
    detail: {
      version: 1,
      isLegacy: true,
      dateYmd: date,
      weekdayKey: null,
      conditionalVisibility: true,
      visibleGoalsCount: null,
      subtasksDoneTotal: null,
      subtasksValidTotal: null,
      goalsCompleteCount: null,
      goalsTotalCount: null,
      goals: [],
    },
  };
}

/** @param {unknown[]} history */
export function normalizeHistoryArray(history) {
  if (!Array.isArray(history)) return [];
  return history
    .map((x) => normalizeHistoryEntryForRead(x))
    .filter(Boolean);
}
