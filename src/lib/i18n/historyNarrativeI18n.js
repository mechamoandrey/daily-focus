import { getPerformanceClassification } from "@/lib/analytics";
import {
  formatWeekdayLong,
  getLocalizedGoalTitle,
  localizeSubtaskLabel,
} from "@/lib/i18n/goalDisplay";

/** @param {object[]} history @param {object} bundle @param {(k: string, vars?: Record<string, string | number>) => string} t */
export function buildIntelligenceNarrative(history, bundle, t) {
  const lines = [];
  const alerts = [];
  const positive = [];

  if (history.length === 0) {
    return {
      lines: [t("history.narrative.empty")],
      alerts: [],
      positive: [],
    };
  }

  const s = bundle.snapshot;
  const perf = getPerformanceClassification(history);
  const label = t(perf.labelKey);

  if (perf.avg7 != null) {
    lines.push(t("history.narrative.paceBand", { label, avg7: perf.avg7 }));
  }

  if (
    bundle.trend7.direction === "up" &&
    bundle.trend7.last7Avg != null &&
    bundle.trend7.prev7Avg != null
  ) {
    lines.push(
      t("history.narrative.trendUp", {
        last: bundle.trend7.last7Avg,
        prev: bundle.trend7.prev7Avg,
      })
    );
    positive.push(t("history.narrative.positiveTrend"));
  } else if (
    bundle.trend7.direction === "down" &&
    bundle.trend7.last7Avg != null &&
    bundle.trend7.prev7Avg != null
  ) {
    lines.push(
      t("history.narrative.trendDown", {
        last: bundle.trend7.last7Avg,
        prev: bundle.trend7.prev7Avg,
      })
    );
    alerts.push(t("history.narrative.alertTrendDown"));
  }

  if (
    bundle.trend30.direction === "up" &&
    bundle.trend30.lastAvg != null &&
    bundle.trend30.prevAvg != null &&
    history.length >= 30
  ) {
    lines.push(
      t("history.narrative.trend30", {
        last: bundle.trend30.lastAvg,
        prev: bundle.trend30.prevAvg,
      })
    );
  }

  if (bundle.goalRankings.mostConsistent) {
    const title = getLocalizedGoalTitle(
      bundle.goalRankings.mostConsistent.id,
      bundle.goalRankings.mostConsistent.title,
      t
    );
    lines.push(
      t("history.narrative.strongest", {
        title,
        rate: bundle.goalRankings.mostConsistent.completionRate,
      })
    );
  }
  if (
    bundle.goalRankings.mostNeglected &&
    bundle.goalRankings.mostNeglected.id !== bundle.goalRankings.mostConsistent?.id
  ) {
    const title = getLocalizedGoalTitle(
      bundle.goalRankings.mostNeglected.id,
      bundle.goalRankings.mostNeglected.title,
      t
    );
    lines.push(
      t("history.narrative.neglected", {
        title,
        rate: bundle.goalRankings.mostNeglected.failureRate,
      })
    );
  }

  if (
    bundle.weekday.worst &&
    bundle.weekday.best &&
    bundle.weekday.best.weekdayIndex !== bundle.weekday.worst.weekdayIndex
  ) {
    lines.push(
      t("history.narrative.weakDay", {
        day: formatWeekdayLong(bundle.weekday.worst.weekdayIndex, t),
      })
    );
    lines.push(
      t("history.narrative.strongDay", {
        day: formatWeekdayLong(bundle.weekday.best.weekdayIndex, t),
      })
    );
  }

  if (bundle.bottlenecks.mostIgnored) {
    const b = bundle.bottlenecks.mostIgnored;
    const labelLoc = localizeSubtaskLabel(b.goalId, b.label, t);
    const goalTitle = getLocalizedGoalTitle(b.goalId, b.goalTitle, t);
    lines.push(
      t("history.narrative.bottleneck", {
        label: labelLoc,
        goal: goalTitle,
        rate: b.completionRate,
      })
    );
  }

  if (s.currentStreak > 0) {
    positive.push(t("history.narrative.streak", { n: s.currentStreak }));
  }
  if (s.consistencyPct != null && s.consistencyPct >= 50) {
    positive.push(t("history.narrative.consistencyGood", { pct: s.consistencyPct }));
  }

  if (
    bundle.goalRankings.leastConsistent &&
    bundle.goalRankings.leastConsistent.completionRate < 35
  ) {
    const title = getLocalizedGoalTitle(
      bundle.goalRankings.leastConsistent.id,
      bundle.goalRankings.leastConsistent.title,
      t
    );
    alerts.push(t("history.narrative.alertLowClose", { title }));
  }

  return {
    lines: lines.slice(0, 8),
    alerts: alerts.slice(0, 4),
    positive: positive.slice(0, 4),
  };
}
