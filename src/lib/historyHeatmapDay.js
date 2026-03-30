import {
  getDayProgress,
  getDetailGoals,
  goalIsComplete100,
  goalProgress,
} from "@/lib/analytics";

/**
 * Status band for heatmap tooltip (maps to heatmap.status.*).
 * @param {number} percent
 * @param {boolean} hasEntry
 */
export function heatmapStatusBand(percent, hasEntry) {
  if (!hasEntry) return "none";
  if (percent >= 100) return "full";
  if (percent >= 70) return "good";
  if (percent >= 30) return "partial";
  return "low";
}

/** Goal progress for a given day (null if goal wasn't visible that day). */
export function getGoalPercentInEntry(entry, goalId) {
  if (!entry || !goalId) return null;
  const g = getDetailGoals(entry).find(
    (x) => x && String(x.id) === String(goalId)
  );
  if (!g) return null;
  return goalProgress(g);
}

/**
 * @param {number} p
 * @returns {keyof typeof import("@/lib/i18n/messagesExtended.js")} — dayPerf.*
 */
export function dayPerformanceLabelKey(p) {
  if (p >= 90) return "dayPerf.excellent";
  if (p >= 70) return "dayPerf.good";
  if (p >= 50) return "dayPerf.medium";
  if (p >= 30) return "dayPerf.low";
  return "dayPerf.critical";
}

/**
 * @param {object} entry
 * @param {(k: string, vars?: Record<string, string | number>) => string} t
 */
export function buildDayNarrative(entry, t) {
  const d = entry?.detail;
  const p = getDayProgress(entry);
  if (!d || d.isLegacy) {
    return t("dayModal.legacyNarrative", { p });
  }
  const gc = d.goalsCompleteCount ?? 0;
  const gt = d.goalsTotalCount ?? 0;
  const goals = d.goals || [];
  const worst = goals.reduce(
    (a, g) => {
      const gp = goalProgress(g);
      return gp < a.pct ? { pct: gp, title: g.title } : a;
    },
    { pct: 101, title: "" }
  );
  if (p === 100) {
    return t("dayModal.narrativeStrong", { gc, gt });
  }
  if (worst.pct < 100 && worst.title) {
    return t("dayModal.narrativeWorst", { p, gc, gt, title: worst.title });
  }
  return t("dayModal.narrativeDefault", { p, gc, gt });
}

/**
 * Resumo estruturado para tooltip do heatmap (strings resolvidas na UI com t()).
 * @param {object | null} entry
 * @param {{ goalId?: string | null }} [options]
 */
export function getHeatmapDaySummary(entry, options) {
  const goalId = options?.goalId;

  if (!entry) {
    return { kind: "empty", dateYmd: null };
  }

  if (goalId) {
    const gp = getGoalPercentInEntry(entry, goalId);
    if (gp == null) {
      return {
        kind: "no_goal_day",
        dateYmd: entry.date,
        percent: null,
        statusBand: "none",
      };
    }
    const g = getDetailGoals(entry).find(
      (x) => String(x.id) === String(goalId)
    );
    const title = g && typeof g.title === "string" ? g.title : "—";
    return {
      kind: "goal",
      dateYmd: entry.date,
      percent: gp,
      goalTitle: title,
      goalClosed: goalIsComplete100(g),
      statusBand: heatmapStatusBand(gp, true),
    };
  }

  const p = getDayProgress(entry);
  const d = entry.detail;
  let goalsComplete = null;
  let goalsTotal = null;
  let subtasksDone = null;
  let subtasksTotal = null;
  let legacyDetail = false;

  if (d && typeof d === "object" && !d.isLegacy) {
    legacyDetail = false;
    if (d.goalsCompleteCount != null && d.goalsTotalCount != null) {
      goalsComplete = d.goalsCompleteCount;
      goalsTotal = d.goalsTotalCount;
    }
    if (d.subtasksDoneTotal != null && d.subtasksValidTotal != null) {
      subtasksDone = d.subtasksDoneTotal;
      subtasksTotal = d.subtasksValidTotal;
    }
  } else {
    legacyDetail = true;
  }

  return {
    kind: "day",
    dateYmd: entry.date,
    percent: p,
    goalsComplete,
    goalsTotal,
    subtasksDone,
    subtasksTotal,
    legacyDetail,
    statusBand: heatmapStatusBand(p, true),
  };
}
