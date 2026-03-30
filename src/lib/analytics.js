import { parseYMD, ymdCompare } from "@/lib/dateUtils";
import { messages } from "@/lib/i18n/messages";
import { resolveInitialLocale } from "@/lib/i18n/resolveLocale";
function resolveT(t) {
  if (t) return t;
  const loc = typeof window !== "undefined" ? resolveInitialLocale() : "pt";
  return (key, vars) => {
    let s = messages[loc][key] ?? messages.pt[key] ?? key;
    if (vars && typeof vars === "object") {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return s;
  };
}
const WEEKDAY_SHORT_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
export function getDayProgress(entry) {
  const p = entry?.percentComplete;
  if (typeof p !== "number" || Number.isNaN(p)) return 0;
  return Math.min(100, Math.max(0, Math.round(p)));
}
export function sortedAsc(history) {
  return [...history].sort((a, b) => ymdCompare(a.date, b.date));
}
export function sortedDesc(history) {
  return [...history].sort((a, b) => ymdCompare(b.date, a.date));
}
export function getAverageProgress(history, days) {
  const desc = sortedDesc(history);
  const n = Math.min(Math.max(0, days), desc.length);
  if (n === 0) return null;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += getDayProgress(desc[i]);
  return Math.round(sum / n);
}
export function getCurrentStreak(history) {
  const desc = sortedDesc(history);
  let c = 0;
  for (const h of desc) {
    if (getDayProgress(h) === 100) c += 1;else break;
  }
  return c;
}
export function getBestStreak(history) {
  const asc = sortedAsc(history);
  let best = 0;
  let cur = 0;
  for (const h of asc) {
    if (getDayProgress(h) === 100) {
      cur += 1;
      if (cur > best) best = cur;
    } else {
      cur = 0;
    }
  }
  return best;
}
export function countDaysAt100(history) {
  return history.filter(h => getDayProgress(h) === 100).length;
}
export function getFullDayRate(history) {
  const total = history.length;
  if (total === 0) return null;
  return Math.round(countDaysAt100(history) / total * 100);
}
function detailGoals(entry) {
  const d = entry?.detail;
  if (!d || typeof d !== "object") return [];
  if (d.isLegacy) return [];
  const g = d.goals;
  return Array.isArray(g) ? g : [];
}
export function getDetailGoals(entry) {
  return detailGoals(entry);
}
function goalProgress(g) {
  const p = g?.goalPercent;
  if (typeof p !== "number" || Number.isNaN(p)) return 0;
  return Math.min(100, Math.max(0, Math.round(p)));
}
export function goalIsComplete100(g) {
  return goalProgress(g) === 100;
}
export { goalProgress };
export function getGoalStats(history) {
  const map = new Map();
  for (const entry of history) {
    const goals = detailGoals(entry);
    for (const g of goals) {
      if (!g || typeof g !== "object" || g.id == null) continue;
      const id = String(g.id);
      const title = typeof g.title === "string" ? g.title : id;
      const row = map.get(id) || {
        id,
        title,
        appearances: 0,
        completions: 0,
        sumProgress: 0
      };
      row.appearances += 1;
      if (goalIsComplete100(g)) row.completions += 1;
      row.sumProgress += goalProgress(g);
      row.title = title;
      map.set(id, row);
    }
  }
  return [...map.values()].map(row => {
    const ap = row.appearances;
    const completionRate = ap > 0 ? Math.round(row.completions / ap * 100) : 0;
    const failureRate = ap > 0 ? Math.round(100 - completionRate) : 0;
    const avgProgress = ap > 0 ? Math.round(row.sumProgress / ap) : 0;
    return {
      id: row.id,
      title: row.title,
      appearances: ap,
      completions: row.completions,
      completionRate,
      failureRate,
      avgProgress
    };
  });
}
function filterByMinAppearances(stats, minAppearances) {
  return stats.filter(s => s.appearances >= minAppearances);
}
function pickMostConsistentFromStats(goalStats) {
  const eligible = filterByMinAppearances(goalStats, 3);
  if (eligible.length === 0) return null;
  return [...eligible].sort((a, b) => b.completionRate - a.completionRate)[0];
}
function pickMostNeglectedFromStats(goalStats) {
  const eligible = filterByMinAppearances(goalStats, 3);
  if (eligible.length === 0) return null;
  return [...eligible].sort((a, b) => a.completionRate - b.completionRate)[0];
}
export function getMostConsistentGoal(history) {
  return pickMostConsistentFromStats(getGoalStats(history));
}
export function getMostNeglectedGoal(history) {
  return pickMostNeglectedFromStats(getGoalStats(history));
}
export function getSubtaskStats(history) {
  const map = new Map();
  for (const entry of history) {
    for (const g of detailGoals(entry)) {
      if (!g || typeof g !== "object" || g.id == null) continue;
      const goalId = String(g.id);
      const goalTitle = typeof g.title === "string" ? g.title : goalId;
      const done = new Set((g.subtasksCompletedLabels || []).map(x => String(x)));
      const pend = new Set((g.subtasksPendingLabels || []).map(x => String(x)));
      const all = new Set([...done, ...pend]);
      for (const label of all) {
        const key = `${goalId}|${label}`;
        const row = map.get(key) || {
          goalId,
          goalTitle,
          label,
          appearances: 0,
          completed: 0
        };
        row.appearances += 1;
        if (done.has(label)) row.completed += 1;
        row.goalTitle = goalTitle;
        map.set(key, row);
      }
    }
  }
  return [...map.values()].map(row => {
    const ap = row.appearances;
    const completionRate = ap > 0 ? Math.round(row.completed / ap * 100) : 0;
    return {
      ...row,
      completionRate,
      failureRate: ap > 0 ? Math.round(100 - completionRate) : 0
    };
  });
}
function pickMostIgnoredSubtaskFromStats(subtaskStats) {
  const eligible = subtaskStats.filter(s => s.appearances >= 3);
  if (eligible.length === 0) return null;
  return [...eligible].sort((a, b) => a.completionRate - b.completionRate)[0];
}
export function getMostIgnoredSubtask(history) {
  return pickMostIgnoredSubtaskFromStats(getSubtaskStats(history));
}
export function getTrend(history) {
  const desc = sortedDesc(history);
  if (desc.length < 7) {
    return {
      direction: "insufficient",
      last7Avg: desc.length ? getAverageProgress(history, 7) : null,
      prev7Avg: null,
      delta: null
    };
  }
  const last7 = desc.slice(0, 7);
  const prev7 = desc.slice(7, 14);
  const avgLast = Math.round(last7.reduce((a, h) => a + getDayProgress(h), 0) / last7.length);
  if (prev7.length === 0) {
    return {
      direction: "insufficient",
      last7Avg: avgLast,
      prev7Avg: null,
      delta: null
    };
  }
  const avgPrev = Math.round(prev7.reduce((a, h) => a + getDayProgress(h), 0) / prev7.length);
  const delta = avgLast - avgPrev;
  let direction = "stable";
  if (delta >= 1) direction = "up";else if (delta <= -1) direction = "down";
  return {
    direction,
    last7Avg: avgLast,
    prev7Avg: avgPrev,
    delta
  };
}
export function getTrendWindow(history, n) {
  const desc = sortedDesc(history);
  if (desc.length < n) {
    return {
      direction: "insufficient",
      lastAvg: desc.length > 0 ? Math.round(desc.reduce((a, h) => a + getDayProgress(h), 0) / desc.length) : null,
      prevAvg: null,
      delta: null
    };
  }
  const last = desc.slice(0, n);
  const prev = desc.slice(n, n + n);
  const lastAvg = Math.round(last.reduce((a, h) => a + getDayProgress(h), 0) / last.length);
  if (prev.length === 0) {
    return {
      direction: "insufficient",
      lastAvg,
      prevAvg: null,
      delta: null
    };
  }
  const prevAvg = Math.round(prev.reduce((a, h) => a + getDayProgress(h), 0) / prev.length);
  const delta = lastAvg - prevAvg;
  let direction = "stable";
  if (delta >= 1) direction = "up";else if (delta <= -1) direction = "down";
  return {
    direction,
    lastAvg,
    prevAvg,
    delta
  };
}
export function getMovingAverage7Series(history) {
  const asc = sortedAsc(history);
  const out = [];
  for (let i = 0; i < asc.length; i++) {
    const start = Math.max(0, i - 6);
    const window = asc.slice(start, i + 1);
    const sum = window.reduce((a, h) => a + getDayProgress(h), 0);
    out.push({
      date: asc[i].date,
      movingAvg7: Math.round(sum / window.length)
    });
  }
  return out;
}
function weekdayIndexMondayFirst(dateYmd) {
  const d = parseYMD(dateYmd);
  const js = d.getDay();
  return (js + 6) % 7;
}
export function getWeekdayStats(history) {
  const buckets = Array.from({
    length: 7
  }, () => ({
    sum: 0,
    n: 0
  }));
  for (const h of history) {
    const idx = weekdayIndexMondayFirst(h.date);
    const p = getDayProgress(h);
    buckets[idx].sum += p;
    buckets[idx].n += 1;
  }
  const byDay = buckets.map((b, i) => ({
    weekdayIndex: i,
    labelKey: WEEKDAY_SHORT_KEYS[i],
    avgProgress: b.n > 0 ? Math.round(b.sum / b.n) : null,
    days: b.n
  }));
  const withData = byDay.filter(x => x.avgProgress != null && x.days > 0);
  let best = null;
  let worst = null;
  if (withData.length > 0) {
    best = [...withData].sort((a, b) => (b.avgProgress ?? 0) - (a.avgProgress ?? 0))[0];
    worst = [...withData].sort((a, b) => (a.avgProgress ?? 0) - (b.avgProgress ?? 0))[0];
  }
  return {
    byDay,
    best,
    worst
  };
}
export function getConsistencyRate(history) {
  const total = history.length;
  if (total === 0) return null;
  const ok = history.filter(h => getDayProgress(h) >= 80).length;
  return Math.round(ok / total * 100);
}
export function getPerformanceClassification(history) {
  const avg7 = getAverageProgress(history, 7);
  if (avg7 == null) {
    return {
      key: "none",
      labelKey: "perf.none",
      avg7: null
    };
  }
  if (avg7 >= 90) return {
    key: "excellent",
    labelKey: "perf.excellent",
    avg7
  };
  if (avg7 >= 70) return {
    key: "good",
    labelKey: "perf.good",
    avg7
  };
  if (avg7 >= 50) return {
    key: "medium",
    labelKey: "perf.medium",
    avg7
  };
  if (avg7 >= 30) return {
    key: "low",
    labelKey: "perf.low",
    avg7
  };
  return {
    key: "critical",
    labelKey: "perf.critical",
    avg7
  };
}
export function computeAnalyticsSnapshot(history) {
  const totalDays = history.length;
  const avg7 = getAverageProgress(history, 7);
  const avg30 = getAverageProgress(history, 30);
  const currentStreak = getCurrentStreak(history);
  const bestStreak = getBestStreak(history);
  const fullDayCount = countDaysAt100(history);
  const fullDayRatePct = getFullDayRate(history);
  const consistencyPct = getConsistencyRate(history);
  const trend = getTrend(history);
  const weekday = getWeekdayStats(history);
  const goalStats = getGoalStats(history);
  const subtaskStats = getSubtaskStats(history);
  const mostConsistent = pickMostConsistentFromStats(goalStats);
  const mostNeglected = pickMostNeglectedFromStats(goalStats);
  const mostIgnoredSubtask = pickMostIgnoredSubtaskFromStats(subtaskStats);
  const performance = getPerformanceClassification(history);
  return {
    totalDays,
    avg7,
    avg30,
    currentStreak,
    bestStreak,
    fullDayCount,
    fullDayRatePct,
    consistencyPct,
    trend,
    weekday,
    goalStats,
    subtaskStats,
    mostConsistentGoal: mostConsistent,
    mostNeglectedGoal: mostNeglected,
    mostIgnoredSubtask,
    performance
  };
}
export function buildInsights(history, snapshot, t) {
  const tr = resolveT(t);
  const s = snapshot || computeAnalyticsSnapshot(history);
  const lines = [];
  if (history.length === 0) {
    lines.push(tr("analytics.insight.noHistory"));
    return lines;
  }
  if (s.consistencyPct != null) {
    lines.push(tr("analytics.insight.consistencyGeneral", {
      pct: s.consistencyPct
    }));
  }
  if (s.performance.avg7 != null) {
    lines.push(tr("analytics.insight.recentPerformance", {
      label: tr(s.performance.labelKey),
      avg7: s.performance.avg7
    }));
  }
  const hasDetail = s.goalStats.some(g => g.appearances > 0);
  if (!hasDetail) {
    lines.push(tr("analytics.insight.noGoalDetail"));
  }
  if (s.mostConsistentGoal) {
    lines.push(tr("analytics.insight.mostConsistent", {
      title: s.mostConsistentGoal.title,
      rate: s.mostConsistentGoal.completionRate
    }));
  }
  if (s.mostNeglectedGoal && s.mostNeglectedGoal.id !== s.mostConsistentGoal?.id) {
    lines.push(tr("analytics.insight.mostNeglected", {
      title: s.mostNeglectedGoal.title,
      rate: s.mostNeglectedGoal.completionRate
    }));
  }
  if (s.trend.direction === "up" && s.trend.last7Avg != null && s.trend.prev7Avg != null) {
    lines.push(tr("analytics.insight.trendUp", {
      last7: s.trend.last7Avg,
      prev7: s.trend.prev7Avg
    }));
  } else if (s.trend.direction === "down" && s.trend.last7Avg != null && s.trend.prev7Avg != null) {
    lines.push(tr("analytics.insight.trendDown", {
      last7: s.trend.last7Avg,
      prev7: s.trend.prev7Avg
    }));
  } else if (s.trend.direction === "stable" && s.trend.last7Avg != null && s.trend.prev7Avg != null) {
    lines.push(tr("analytics.insight.trendStable", {
      last7: s.trend.last7Avg,
      prev7: s.trend.prev7Avg
    }));
  }
  if (s.weekday.best && s.weekday.worst && s.weekday.best.weekdayIndex !== s.weekday.worst.weekdayIndex) {
    lines.push(tr("analytics.insight.weekdayBest", {
      day: tr(`weekday.long.${s.weekday.best.labelKey}`),
      avg: s.weekday.best.avgProgress
    }));
    lines.push(tr("analytics.insight.weekdayWorst", {
      day: tr(`weekday.long.${s.weekday.worst.labelKey}`),
      avg: s.weekday.worst.avgProgress
    }));
  }
  if (s.mostIgnoredSubtask) {
    lines.push(tr("analytics.insight.mostIgnoredSubtask", {
      label: s.mostIgnoredSubtask.label,
      goalTitle: s.mostIgnoredSubtask.goalTitle,
      rate: s.mostIgnoredSubtask.completionRate
    }));
  }
  if (s.fullDayRatePct != null) {
    lines.push(tr("analytics.insight.fullDayRate", {
      pct: s.fullDayRatePct
    }));
  }
  return lines.slice(0, 12);
}
export function interpretMomentumPhrase(percent, t) {
  const tr = resolveT(t);
  if (percent >= 90) return tr("analytics.momentum.90");
  if (percent >= 70) return tr("analytics.momentum.70");
  if (percent >= 50) return tr("analytics.momentum.50");
  if (percent >= 30) return tr("analytics.momentum.30");
  return tr("analytics.momentum.0");
}
export function getMomentumBadgeClasses(score) {
  if (score == null) {
    return "ring-zinc-500/30 bg-zinc-900/80 text-zinc-400";
  }
  if (score >= 90) return "ring-emerald-400/40 bg-emerald-500/15 text-emerald-200";
  if (score >= 70) return "ring-teal-400/35 bg-teal-500/12 text-teal-100";
  if (score >= 50) return "ring-violet-400/35 bg-violet-500/12 text-violet-100";
  if (score >= 30) return "ring-amber-400/35 bg-amber-500/12 text-amber-100";
  return "ring-rose-400/35 bg-rose-500/12 text-rose-100";
}
export function buildBehaviorReadout(history, snapshot, t) {
  const tr = resolveT(t);
  const s = snapshot || computeAnalyticsSnapshot(history);
  const bullets = [];
  let reinforcement = null;
  if (history.length === 0) {
    return {
      bullets: [tr("analytics.behavior.empty1"), tr("analytics.behavior.empty2"), tr("analytics.behavior.empty3")],
      reinforcement: null
    };
  }
  if (s.performance.avg7 != null) {
    bullets.push(tr("analytics.behavior.momentumLine", {
      phrase: interpretMomentumPhrase(s.performance.avg7, t),
      avg7: s.performance.avg7
    }));
  }
  if (s.trend.direction === "up" && s.trend.last7Avg != null && s.trend.prev7Avg != null) {
    bullets.push(tr("analytics.behavior.trendUp", {
      prev7: s.trend.prev7Avg,
      last7: s.trend.last7Avg
    }));
  } else if (s.trend.direction === "down" && s.trend.last7Avg != null && s.trend.prev7Avg != null) {
    bullets.push(tr("analytics.behavior.trendDown", {
      last7: s.trend.last7Avg,
      prev7: s.trend.prev7Avg
    }));
  }
  if (s.mostConsistentGoal) {
    bullets.push(tr("analytics.behavior.mostConsistent", {
      title: s.mostConsistentGoal.title
    }));
  }
  if (s.mostNeglectedGoal && s.mostNeglectedGoal.id !== s.mostConsistentGoal?.id && bullets.length < 5) {
    bullets.push(tr("analytics.behavior.mostNeglected", {
      title: s.mostNeglectedGoal.title
    }));
  }
  if (s.weekday.worst && s.weekday.best && s.weekday.best.weekdayIndex !== s.weekday.worst.weekdayIndex && bullets.length < 5) {
    bullets.push(tr("analytics.behavior.weakDay", {
      day: tr(`weekday.long.${s.weekday.worst.labelKey}`)
    }));
  }
  if (s.consistencyPct != null && bullets.length < 5) {
    bullets.push(tr("analytics.behavior.consistencyGood", {
      pct: s.consistencyPct
    }));
  }
  if (s.fullDayRatePct != null && bullets.length < 5) {
    bullets.push(tr("analytics.behavior.fullDayRate", {
      pct: s.fullDayRatePct
    }));
  }
  const finalBullets = bullets.slice(0, 5);
  const fallbacks = [tr("analytics.behavior.fallbackDays", {
    totalDays: s.totalDays
  }), tr("analytics.behavior.fallbackOpenDay"), tr("analytics.behavior.fallbackFocus")];
  let fb = 0;
  while (finalBullets.length < 3 && history.length > 0 && fb < fallbacks.length) {
    finalBullets.push(fallbacks[fb]);
    fb += 1;
  }
  if (s.currentStreak > 0) {
    reinforcement = tr("analytics.behavior.reinforcementStreak", {
      n: s.currentStreak
    });
  } else if (s.trend.direction === "up") {
    reinforcement = tr("analytics.behavior.reinforcementUp");
  } else if (s.fullDayCount > 0 && s.fullDayRatePct != null && s.fullDayRatePct >= 35) {
    reinforcement = tr("analytics.behavior.reinforcementHabit");
  }
  return {
    bullets: finalBullets.slice(0, 5),
    reinforcement
  };
}
export function computeHistoryKpis(history) {
  const s = computeAnalyticsSnapshot(history);
  return {
    totalDays: s.totalDays,
    avg7: s.avg7,
    avg30: s.avg30,
    currentStreak: s.currentStreak,
    bestStreak: s.bestStreak,
    fullDays: s.fullDayCount,
    fullDayRatePct: s.fullDayRatePct,
    consistencyPct: s.consistencyPct,
    trend: s.trend,
    weekday: s.weekday,
    performance: s.performance
  };
}
export function aggregateByMeta(history) {
  return getGoalStats(history).map(g => ({
    ...g,
    rate: g.completionRate,
    successes: g.completions,
    failDays: g.appearances - g.completions,
    avgPercent: g.avgProgress
  }));
}
