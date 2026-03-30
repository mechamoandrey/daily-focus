import {
  computeAnalyticsSnapshot,
  getDayProgress,
  getDetailGoals,
  getGoalStats,
  getSubtaskStats,
  getTrend,
  getTrendWindow,
  getWeekdayStats,
  goalIsComplete100,
  sortedAsc,
  sortedDesc,
} from "@/lib/analytics";
import { parseYMD, ymdCompare } from "@/lib/dateUtils";

/**
 * Estatísticas estendidas por meta (apenas dias com a meta no detail).
 * @param {import("./analytics.js").HistoryEntry[]} history
 */
export function computeGoalDeepStats(history) {
  const base = getGoalStats(history);
  const asc = sortedAsc(history);

  /** @type {Map<string, ReturnType<typeof getGoalStats>[0] & { streak: number, bestStreak: number, lastCompletedDate: string | null, lastFailedDate: string | null, lastAppearedDate: string | null }>} */
  const out = new Map();

  for (const row of base) {
    out.set(row.id, {
      ...row,
      streak: 0,
      bestStreak: 0,
      lastCompletedDate: null,
      lastFailedDate: null,
      lastAppearedDate: null,
    });
  }

  const descAll = sortedDesc(history);

  for (const id of out.keys()) {
    let bestStreak = 0;
    let cur = 0;
    for (const e of asc) {
      const g = getDetailGoals(e).find((x) => String(x.id) === id);
      if (!g) continue;
      if (goalIsComplete100(g)) {
        cur += 1;
        if (cur > bestStreak) bestStreak = cur;
      } else {
        cur = 0;
      }
    }

    let lastCompletedDate = null;
    let lastFailedDate = null;
    let lastAppearedDate = null;
    for (const e of descAll) {
      const g = getDetailGoals(e).find((x) => String(x.id) === id);
      if (!g) continue;
      if (!lastAppearedDate) lastAppearedDate = e.date;
      if (goalIsComplete100(g) && !lastCompletedDate) lastCompletedDate = e.date;
      if (!goalIsComplete100(g) && !lastFailedDate) lastFailedDate = e.date;
    }

    let run = 0;
    for (const e of descAll) {
      const g = getDetailGoals(e).find((x) => String(x.id) === id);
      if (!g) continue;
      if (goalIsComplete100(g)) run += 1;
      else break;
    }

    const row = out.get(id);
    if (row) {
      row.streak = run;
      row.bestStreak = bestStreak;
      row.lastCompletedDate = lastCompletedDate;
      row.lastFailedDate = lastFailedDate;
      row.lastAppearedDate = lastAppearedDate;
    }
  }

  return [...out.values()];
}

/**
 * Rankings derivados de `computeGoalDeepStats` (mín. 2 aparições para ranquear).
 * @param {ReturnType<typeof computeGoalDeepStats>} deep
 */
export function computeGoalRankings(deep) {
  const eligible = deep.filter((g) => g.appearances >= 2);
  if (eligible.length === 0) {
    return {
      mostConsistent: null,
      leastConsistent: null,
      mostNeglected: null,
      bestAvg: null,
      worstAvg: null,
    };
  }
  const byRate = [...eligible].sort((a, b) => b.completionRate - a.completionRate);
  const byAvg = [...eligible].sort((a, b) => b.avgProgress - a.avgProgress);
  return {
    mostConsistent: byRate[0],
    leastConsistent: byRate[byRate.length - 1],
    mostNeglected: [...eligible].sort(
      (a, b) => b.failureRate - a.failureRate
    )[0],
    bestAvg: byAvg[0],
    worstAvg: byAvg[byAvg.length - 1],
  };
}

/** @param {ReturnType<typeof getSubtaskStats>} subtaskStats */
export function computeSubtaskBottlenecks(subtaskStats) {
  const eligible = subtaskStats.filter((s) => s.appearances >= 2);
  if (eligible.length === 0) {
    return {
      mostIgnored: null,
      mostConsistent: null,
      mostBlocking: null,
    };
  }
  const byRateAsc = [...eligible].sort((a, b) => a.completionRate - b.completionRate);
  const byRateDesc = [...eligible].sort((a, b) => b.completionRate - a.completionRate);
  return {
    mostIgnored: byRateAsc[0],
    mostConsistent: byRateDesc[0],
    mostBlocking: byRateAsc[0],
  };
}

/** Melhor e pior dia (por % do dia) no conjunto filtrado. */
export function pickBestWorstDays(history) {
  if (history.length === 0) {
    return { best: null, worst: null };
  }
  const desc = sortedDesc(history);
  let best = desc[0];
  let worst = desc[0];
  for (const h of desc) {
    const p = getDayProgress(h);
    if (p > getDayProgress(best)) best = h;
    if (p < getDayProgress(worst)) worst = h;
  }
  return { best, worst };
}

/** ISO week start (Monday, approximate) for aggregation. */
function mondayOfWeekContaining(ymd) {
  const d = parseYMD(ymd);
  const mondayFirst = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - mondayFirst);
  return d;
}

/**
 * Agrega média por semana (chave ~semana do ano).
 * @param {import("./analytics.js").HistoryEntry[]} history
 */
export function computeWeeklyRollups(history) {
  const asc = sortedAsc(history);
  /** @type {Map<string, { sum: number, n: number, startDate: string }>} */
  const map = new Map();
  for (const e of asc) {
    const m = mondayOfWeekContaining(e.date);
    const key = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}-${String(m.getDate()).padStart(2, "0")}`;
    const row = map.get(key) || { sum: 0, n: 0, startDate: key };
    row.sum += getDayProgress(e);
    row.n += 1;
    map.set(key, row);
  }
  return [...map.entries()]
    .map(([k, v]) => ({
      weekKey: k,
      avgProgress: v.n > 0 ? Math.round(v.sum / v.n) : 0,
      days: v.n,
    }))
    .sort((a, b) => ymdCompare(a.weekKey, b.weekKey));
}

/**
 * Melhor e pior semana (por média de progresso).
 * @param {ReturnType<typeof computeWeeklyRollups>} rollups
 */
export function pickBestWorstWeeks(rollups) {
  if (rollups.length === 0) return { best: null, worst: null };
  const sorted = [...rollups].sort((a, b) => b.avgProgress - a.avgProgress);
  return { best: sorted[0], worst: sorted[sorted.length - 1] };
}

/**
 * Um pacote de dados derivados para a página de histórico (evita recálculo espalhado).
 * @param {import("./analytics.js").HistoryEntry[]} history
 */
export function computeHistoricoBundle(history) {
  const snapshot = computeAnalyticsSnapshot(history);
  const goalDeep = computeGoalDeepStats(history);
  const goalRankings = computeGoalRankings(goalDeep);
  const subtaskStats = getSubtaskStats(history);
  const bottlenecks = computeSubtaskBottlenecks(subtaskStats);
  const trend7 = getTrend(history);
  const trend30 = getTrendWindow(history, 30);
  const weekday = getWeekdayStats(history);
  const bestWorstDays = pickBestWorstDays(history);
  const weekly = computeWeeklyRollups(history);
  const bestWorstWeeks = pickBestWorstWeeks(weekly);

  return {
    snapshot,
    goalDeep,
    goalRankings,
    subtaskStats,
    bottlenecks,
    trend7,
    trend30,
    weekday,
    bestWorstDays,
    weekly,
    bestWorstWeeks,
  };
}

export { buildIntelligenceNarrative } from "@/lib/i18n/historyNarrativeI18n";
