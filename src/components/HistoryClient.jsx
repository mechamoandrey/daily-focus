"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CaretDown, CaretRight, Sparkle } from "@phosphor-icons/react";
import { AppShell } from "@/components/AppShell";
import { useDailyFocusState } from "@/hooks/useDailyFocusState";
import { aggregateByMeta, getAverageProgress, getBestStreak, getMomentumBadgeClasses, sortedDesc } from "@/lib/analytics";
import { applyHistoryFilters, PERIOD_30 } from "@/lib/historyFilters";
import { buildIntelligenceNarrative, computeHistoricoBundle } from "@/lib/historyIntelligence";
import { formatYMDLongLocalized } from "@/lib/dateUtils";
import { buildHistoryGoalFilterOptions } from "@/lib/historyGoalFilterOptions";
import { useLocale } from "@/providers/locale-provider";
import { ConsistencyHeatmap } from "@/components/history/ConsistencyHeatmap";
import { DayDetailContent } from "@/components/history/DayDetailContent";
import { GoalDetailModal } from "@/components/history/GoalDetailModal";
import { HistoryFilters } from "@/components/history/HistoryFilters";
import { cn } from "@/lib/cn";
import { DataStateError } from "@/components/DataStateError";
import { interpretNumberLine } from "@/lib/i18n/historyInterpret";
import { formatWeekdayLong, getLocalizedGoalTitle, localizeSubtaskLabel } from "@/lib/i18n/goalDisplay";
const STAGGER = {
  hidden: {
    opacity: 0
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04
    }
  }
};
const ITEM = {
  hidden: {
    opacity: 0,
    y: 10
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
function ShellSkeleton() {
  return <AppShell>
      <main className="flex-1 px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-12 rounded-2xl bg-zinc-900/60" />
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({
            length: 6
          }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-zinc-900/60" />)}
          </div>
          <div className="h-48 rounded-2xl bg-zinc-900/60" />
        </div>
      </main>
    </AppShell>;
}
function KpiCard({
  title,
  humanTitle,
  humanSubtitle,
  value,
  hint,
  interpret
}) {
  return <motion.div variants={ITEM} className={cn("group rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-4 ring-1 ring-white/[0.04]", "transition-[opacity,box-shadow,background-color] duration-200 ease-out", "hover:bg-zinc-900/65 hover:ring-white/[0.08]")}>
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
        {title}
      </p>
      {humanTitle ? <p className="mt-1 text-xs font-medium text-zinc-300">{humanTitle}</p> : null}
      <p className="mt-2 text-2xl font-semibold tabular-nums text-zinc-50">
        {value}
      </p>
      {humanSubtitle ? <p className="mt-1 text-[11px] leading-snug text-zinc-500">
          {humanSubtitle}
        </p> : null}
      {hint ? <p className="mt-1 text-[11px] text-zinc-600">{hint}</p> : null}
      {interpret ? <p className="mt-2 border-t border-white/[0.05] pt-2 text-[11px] leading-relaxed text-zinc-400">
          {interpret}
        </p> : null}
    </motion.div>;
}
function ProgressBarsChart({
  entries,
  formatDate
}) {
  const {
    t
  } = useLocale();
  const slice = entries.slice(0, Math.min(90, entries.length));
  const [hover, setHover] = useState(null);
  const fmt = formatDate ?? (d => d);
  return <motion.div variants={ITEM} className="rounded-2xl border border-white/[0.06] bg-zinc-950/50 p-5 sm:p-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
        {t("dashboard.dailyEvolution")}
      </p>
      <p className="mt-1 text-sm text-zinc-300">{t("dashboard.barHint")}</p>
      <p className="mt-0.5 text-xs text-zinc-500">
        {t("dashboard.barSub", {
        n: slice.length
      })}
      </p>
      {hover ? <p className="mt-3 rounded-lg bg-zinc-900/90 px-3 py-2 text-sm text-zinc-200 ring-1 ring-white/[0.08]">
          <span className="tabular-nums text-violet-300">
            {hover.percentComplete ?? 0}%
          </span>
          <span className="mx-2 text-zinc-600">·</span>
          <span className="capitalize text-zinc-400">
            {fmt(hover.date)}
          </span>
          {hover.completedFullDay ? <span className="ml-2 text-emerald-400/90">
              {t("dashboard.fullDay")}
            </span> : null}
        </p> : <p className="mt-3 text-[11px] text-zinc-600">
          {t("dashboard.hoverBars")}
        </p>}
      <div className="relative mt-4 flex h-36 items-end gap-1.5 overflow-x-auto pb-1">
        {[...slice].reverse().map((h, i) => {
        const pct = Math.min(100, Math.max(0, h.percentComplete ?? 0));
        return <button key={h.date} type="button" onMouseEnter={() => setHover(h)} onFocus={() => setHover(h)} onMouseLeave={() => setHover(null)} onBlur={() => setHover(null)} className={cn("group/bar flex h-full min-h-0 min-w-[12px] max-w-[26px] flex-1 flex-col justify-end outline-none", "cursor-pointer transition-opacity duration-200 hover:opacity-95", "interactive-press")} aria-label={`${h.date} ${pct}%`}>
              <motion.div className={cn("w-full rounded-t-md shadow-sm", h.completedFullDay ? "bg-emerald-500/75 ring-1 ring-emerald-400/30" : "bg-violet-500/55 ring-1 ring-violet-400/20")} initial={{
            height: 0
          }} animate={{
            height: `${pct}%`
          }} transition={{
            delay: i * 0.03,
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1]
          }} whileHover={{
            filter: "brightness(1.12)"
          }} style={{
            minHeight: pct > 0 ? 4 : 0
          }} />
            </button>;
      })}
      </div>
    </motion.div>;
}
function barRate(row) {
  return row.rate ?? row.completionRate ?? 0;
}
function MetaHorizontalBars({
  rows,
  onSelectGoal,
  t
}) {
  const sorted = [...rows].sort((a, b) => barRate(b) - barRate(a));
  if (sorted.length === 0) return null;
  const bestId = sorted[0]?.id;
  const worstId = sorted[sorted.length - 1]?.id;
  return <motion.section variants={ITEM} className="space-y-4">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
          {t("history.metaStrengthTitle")}
        </p>
        <p className="mt-1 text-sm text-zinc-300">
          {t("history.metaStrengthSub")}
        </p>
      </div>
      <ul className="space-y-3">
        {sorted.slice(0, 8).map(row => {
        const r = barRate(row);
        const isBest = row.id === bestId && sorted.length > 1;
        const isWorst = row.id === worstId && sorted.length > 1;
        const title = getLocalizedGoalTitle(String(row.id), row.title, t);
        const inner = <>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-medium text-zinc-100">
                  {title}
                  {isBest ? <span className="ml-2 text-[10px] font-normal text-emerald-400/90">
                      {t("history.bestRate")}
                    </span> : null}
                  {isWorst ? <span className="ml-2 text-[10px] font-normal text-amber-400/85">
                      {t("history.needsAttention")}
                    </span> : null}
                </span>
                <span className="shrink-0 tabular-nums text-zinc-400">{r}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800/80">
                <motion.div className={cn("h-full rounded-full", r >= 70 ? "bg-emerald-500/70" : r >= 40 ? "bg-violet-500/60" : "bg-amber-500/55")} initial={{
              width: 0
            }} animate={{
              width: `${Math.min(100, r)}%`
            }} transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1]
            }} />
              </div>
            </>;
        if (onSelectGoal) {
          return <li key={row.id}>
                <motion.button type="button" onClick={() => onSelectGoal(row)} whileTap={{
              scale: 0.99
            }} className={cn("w-full rounded-xl px-3 py-2 text-left transition duration-200", "cursor-pointer hover:bg-white/[0.05]", "interactive-press", isBest && "ring-1 ring-emerald-500/25", isWorst && "ring-1 ring-amber-500/20")}>
                  {inner}
                </motion.button>
              </li>;
        }
        return <li key={row.id} className={cn("rounded-xl px-3 py-2 transition duration-200", "hover:bg-white/[0.03]", isBest && "ring-1 ring-emerald-500/25", isWorst && "ring-1 ring-amber-500/20")}>
              {inner}
            </li>;
      })}
      </ul>
    </motion.section>;
}
export function HistoryClient() {
  const {
    t,
    locale
  } = useLocale();
  const {
    ready,
    state,
    syncError,
    authLoading,
    bootLoading
  } = useDailyFocusState();
  const [openDate, setOpenDate] = useState(null);
  const [period, setPeriod] = useState(PERIOD_30);
  const [goalId, setGoalId] = useState(null);
  const [goalModalRow, setGoalModalRow] = useState(null);
  const fullHistory = useMemo(() => state?.history ?? [], [state?.history]);
  const filteredHistory = useMemo(() => applyHistoryFilters(fullHistory, {
    period,
    goalId
  }), [fullHistory, period, goalId]);
  const bundle = useMemo(() => computeHistoricoBundle(filteredHistory), [filteredHistory]);
  const narrative = useMemo(() => buildIntelligenceNarrative(filteredHistory, bundle, t), [filteredHistory, bundle, t]);
  const metaRows = useMemo(() => aggregateByMeta(filteredHistory), [filteredHistory]);
  const sorted = useMemo(() => sortedDesc(filteredHistory), [filteredHistory]);
  const goalOptions = useMemo(() => buildHistoryGoalFilterOptions(state, t), [state, t]);
  const historyLast30 = useMemo(() => applyHistoryFilters(fullHistory, {
    period: PERIOD_30,
    goalId
  }), [fullHistory, goalId]);
  const avgCompletion30 = useMemo(() => getAverageProgress(historyLast30, 30), [historyLast30]);
  const bestStreak30 = useMemo(() => getBestStreak(historyLast30), [historyLast30]);
  const formatHistoryDate = useMemo(() => d => formatYMDLongLocalized(d, locale), [locale]);
  const snapshot = bundle.snapshot;
  const score = snapshot.performance.avg7;
  if (syncError && !state && !authLoading && !bootLoading) {
    return <DataStateError message={syncError} />;
  }
  if (!ready || !state) {
    return <ShellSkeleton />;
  }
  return <AppShell>
      <main className="flex-1 px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
        <motion.div className="mx-auto max-w-5xl space-y-10" initial="hidden" animate="show" variants={STAGGER}>
          <motion.div variants={ITEM}>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
              {t("dashboard.analysis")}
            </p>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
                  {t("dashboard.title")}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                  {t("dashboard.subtitle")}
                </p>
              </div>
              <div className={cn("flex flex-col items-end gap-1 rounded-2xl px-4 py-3 ring-2", getMomentumBadgeClasses(score))}>
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  {t("dashboard.recentPace")}
                </p>
                <p className="text-3xl font-semibold tabular-nums leading-none">
                  {score != null ? `${score}` : "—"}
                  <span className="text-lg text-zinc-500">/100</span>
                </p>
                <p className="text-xs text-zinc-400">
                  {t(snapshot.performance.labelKey)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={ITEM}>
            <HistoryFilters period={period} onPeriod={setPeriod} goalId={goalId} onGoal={setGoalId} goalOptions={goalOptions} />
          </motion.div>

          {historyLast30.length > 0 ? <motion.section variants={ITEM} className="rounded-2xl border border-white/[0.06] bg-zinc-900/40 px-4 py-3 ring-1 ring-white/[0.04] sm:px-5 sm:py-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                {t("history.behaviorSummaryTitle")}
              </p>
              <div className="mt-2 flex flex-col gap-1 text-sm text-zinc-300 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-1">
                {avgCompletion30 != null ? <span>
                    {t("history.summaryAvg30", {
                pct: avgCompletion30
              })}
                  </span> : null}
                {bestStreak30 > 0 ? <span className="text-zinc-400">
                    {t("history.summaryBestStreak", {
                n: bestStreak30
              })}
                  </span> : null}
              </div>
            </motion.section> : null}

          <motion.section variants={ITEM} className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/40 via-zinc-950/40 to-zinc-950/80 p-5 sm:p-6 ring-1 ring-violet-500/15">
            <div className="flex flex-wrap items-start gap-3">
              <Sparkle className="mt-0.5 h-6 w-6 shrink-0 text-violet-400" weight="fill" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-violet-300/90">
                  {t("dashboard.reading")}
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-200">
                  {narrative.lines.map((line, i) => <li key={i} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/90" />
                      <span>{line}</span>
                    </li>)}
                </ul>
                {narrative.alerts.length > 0 ? <ul className="mt-4 space-y-2 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-sm text-amber-100/95">
                    {narrative.alerts.map((line, i) => <li key={`a-${i}`}>{line}</li>)}
                  </ul> : null}
                {narrative.positive.length > 0 ? <ul className="mt-3 space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3 text-sm text-emerald-100/95">
                    {narrative.positive.map((line, i) => <li key={`p-${i}`}>{line}</li>)}
                  </ul> : null}
              </div>
            </div>
          </motion.section>

          <motion.section variants={ITEM} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-4 ring-1 ring-white/[0.04]">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                {t("history.compare7")}
              </p>
              <p className="mt-2 text-sm text-zinc-300">
                {bundle.trend7.prev7Avg != null ? `${bundle.trend7.last7Avg}% vs ${bundle.trend7.prev7Avg}%` : t("history.insufficient")}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {bundle.trend7.direction === "up" ? t("history.trend.up") : bundle.trend7.direction === "down" ? t("history.trend.down") : bundle.trend7.direction === "stable" ? t("history.trend.stable") : "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-4 ring-1 ring-white/[0.04]">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                {t("history.compare30")}
              </p>
              <p className="mt-2 text-sm text-zinc-300">
                {bundle.trend30.prevAvg != null ? `${bundle.trend30.lastAvg}% vs ${bundle.trend30.prevAvg}%` : t("history.needMoreDays")}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {bundle.trend30.direction === "up" ? t("history.trend.up") : bundle.trend30.direction === "down" ? t("history.trend.down") : bundle.trend30.direction === "stable" ? t("history.trend.stable") : "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-4 ring-1 ring-white/[0.04]">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                {t("history.bestWorstDay")}
              </p>
              <p className="mt-2 text-xs text-zinc-400">
                {bundle.bestWorstDays.best ? `${t("history.bestPrefix")} ${formatHistoryDate(bundle.bestWorstDays.best.date)} (${bundle.bestWorstDays.best.percentComplete ?? 0}%)` : "—"}
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                {bundle.bestWorstDays.worst ? `${t("history.worstPrefix")} ${formatHistoryDate(bundle.bestWorstDays.worst.date)} (${bundle.bestWorstDays.worst.percentComplete ?? 0}%)` : "—"}
              </p>
            </div>
          </motion.section>

          {bundle.weekly.length >= 2 ? <motion.section variants={ITEM} className="rounded-2xl border border-white/[0.06] bg-zinc-900/35 px-5 py-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                {t("history.weeksAvgTitle")}
              </p>
              <p className="mt-2 text-sm text-zinc-300">
                {bundle.bestWorstWeeks.best && bundle.bestWorstWeeks.worst ? t("history.weeksAvgLine", {
              bestLabel: formatYMDLongLocalized(bundle.bestWorstWeeks.best.weekKey, locale),
              bestPct: bundle.bestWorstWeeks.best.avgProgress,
              worstLabel: formatYMDLongLocalized(bundle.bestWorstWeeks.worst.weekKey, locale),
              worstPct: bundle.bestWorstWeeks.worst.avgProgress
            }) : null}
              </p>
            </motion.section> : null}

          <motion.section variants={ITEM} className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
              {t("history.weekdayPaceTitle")}
            </p>
            <div className="flex flex-wrap gap-2">
              {bundle.weekday.byDay.map(d => d.avgProgress != null ? <div key={d.weekdayIndex} className="flex min-w-[100px] flex-1 flex-col rounded-xl border border-white/[0.06] bg-zinc-950/50 px-3 py-2">
                    <span className="text-[10px] text-zinc-500">
                      {t(`weekday.long.${d.labelKey}`)}
                    </span>
                    <span className="text-lg font-semibold tabular-nums text-zinc-100">
                      {d.avgProgress}%
                    </span>
                  </div> : null)}
            </div>
          </motion.section>

          {bundle.goalRankings.mostConsistent ? <motion.section variants={ITEM} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4">
                <p className="text-[10px] uppercase tracking-wider text-emerald-400/90">
                  {t("history.rankStable")}
                </p>
                <p className="mt-1 font-medium text-zinc-100">
                  {getLocalizedGoalTitle(bundle.goalRankings.mostConsistent.id, bundle.goalRankings.mostConsistent.title, t)}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  {t("history.pctClosed", {
                n: bundle.goalRankings.mostConsistent.completionRate
              })}
                </p>
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-950/15 p-4">
                <p className="text-[10px] uppercase tracking-wider text-amber-400/90">
                  {t("history.rankEscapes")}
                </p>
                <p className="mt-1 font-medium text-zinc-100">
                  {bundle.goalRankings.mostNeglected ? getLocalizedGoalTitle(bundle.goalRankings.mostNeglected.id, bundle.goalRankings.mostNeglected.title, t) : "—"}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  {bundle.goalRankings.mostNeglected ? t("history.pctMissed", {
                n: bundle.goalRankings.mostNeglected.failureRate
              }) : "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-violet-500/20 bg-violet-950/20 p-4">
                <p className="text-[10px] uppercase tracking-wider text-violet-300/90">
                  {t("history.rankBestAvg")}
                </p>
                <p className="mt-1 font-medium text-zinc-100">
                  {bundle.goalRankings.bestAvg ? getLocalizedGoalTitle(bundle.goalRankings.bestAvg.id, bundle.goalRankings.bestAvg.title, t) : "—"}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  {bundle.goalRankings.bestAvg ? t("history.avgProgress", {
                n: bundle.goalRankings.bestAvg.avgProgress
              }) : "—"}
                </p>
              </div>
            </motion.section> : null}

          {bundle.bottlenecks.mostIgnored ? <motion.section variants={ITEM} className="space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                {t("history.bottlenecksTitle")}
              </p>
              <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/40 px-4 py-3 text-sm text-zinc-300">
                <span className="text-zinc-500">{t("history.bottleneckWhere")} </span>
                <span className="font-medium text-zinc-100">
                  “
                  {localizeSubtaskLabel(bundle.bottlenecks.mostIgnored.goalId, bundle.bottlenecks.mostIgnored.label, t)}
                  ”
                </span>
                <span className="text-zinc-500">
                  {" "}
                  {t("history.bottleneckIn")}{" "}
                  {getLocalizedGoalTitle(bundle.bottlenecks.mostIgnored.goalId, bundle.bottlenecks.mostIgnored.goalTitle, t)}{" "}
                  —{" "}
                </span>
                <span className="tabular-nums">
                  {t("history.bottleneckDone", {
                n: bundle.bottlenecks.mostIgnored.completionRate
              })}
                </span>
              </div>
              {bundle.bottlenecks.mostConsistent ? <p className="text-xs text-zinc-500">
                  {t("history.bottleneckConsistent")}{" "}
                  “
                  {localizeSubtaskLabel(bundle.bottlenecks.mostConsistent.goalId, bundle.bottlenecks.mostConsistent.label, t)}
                  ” ({bundle.bottlenecks.mostConsistent.completionRate}%).
                </p> : null}
            </motion.section> : null}

          <motion.section variants={ITEM} className="space-y-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                {t("history.numbersTitle")}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                {t("history.numbersSub")}
              </p>
            </div>
            <motion.div variants={STAGGER} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <KpiCard title={t("history.kpi.avg7.title")} humanTitle={t("history.kpi.avg7.human")} humanSubtitle={t("history.kpi.avg7.sub")} value={snapshot.avg7 != null ? `${snapshot.avg7}%` : "—"} interpret={interpretNumberLine("avg7", snapshot, t)} />
              <KpiCard title={t("history.kpi.avg30.title")} humanTitle={t("history.kpi.avg30.human")} humanSubtitle={t("history.kpi.avg30.sub")} value={snapshot.avg30 != null ? `${snapshot.avg30}%` : "—"} interpret={interpretNumberLine("avg30", snapshot, t)} />
              <KpiCard title={t("history.kpi.streakNow.title")} humanTitle={t("history.kpi.streakNow.human")} humanSubtitle={t("history.kpi.streakNow.sub")} value={snapshot.currentStreak} interpret={interpretNumberLine("streak", snapshot, t)} />
              <KpiCard title={t("history.kpi.bestStreak.title")} humanTitle={t("history.kpi.bestStreak.human")} humanSubtitle={t("history.kpi.bestStreak.sub")} value={snapshot.bestStreak} interpret={interpretNumberLine("bestStreak", snapshot, t)} />
              <KpiCard title={t("history.kpi.fullDays.title")} humanTitle={t("history.kpi.fullDays.human")} humanSubtitle={t("history.kpi.fullDays.sub")} value={snapshot.fullDayRatePct != null ? `${snapshot.fullDayRatePct}%` : "—"} interpret={interpretNumberLine("fullDayRate", snapshot, t)} />
              <KpiCard title={t("history.kpi.consistency.title")} humanTitle={t("history.kpi.consistency.human")} humanSubtitle={t("history.kpi.consistency.sub")} value={snapshot.consistencyPct != null ? `${snapshot.consistencyPct}%` : "—"} interpret={interpretNumberLine("consistency", snapshot, t)} />
              <KpiCard title={t("history.kpi.performanceRead.title")} humanTitle={t("history.kpi.performanceRead.human")} value={t(snapshot.performance.labelKey)} humanSubtitle={snapshot.performance.avg7 != null ? t("history.kpi.performanceRead.scale", {
              n: snapshot.performance.avg7
            }) : undefined} interpret={snapshot.performance.avg7 != null ? t("history.kpi.performanceRead.hint") : null} />
              <KpiCard title={t("history.kpi.weekVsWeek.title")} humanTitle={t("history.kpi.weekVsWeek.human")} value={snapshot.trend.direction === "insufficient" ? "—" : snapshot.trend.direction === "up" ? t("history.trendLabel.up") : snapshot.trend.direction === "down" ? t("history.trendLabel.down") : t("history.trendLabel.stable")} humanSubtitle={snapshot.trend.last7Avg != null && snapshot.trend.prev7Avg != null ? t("history.kpi.weekVsWeek.compare", {
              last: snapshot.trend.last7Avg,
              prev: snapshot.trend.prev7Avg
            }) : t("history.kpi.weekVsWeek.needData")} interpret={interpretNumberLine("trend", snapshot, t)} />
              <KpiCard title={t("history.kpi.fullDayCount.title")} humanTitle={t("history.kpi.fullDayCount.human")} value={snapshot.fullDayCount} interpret={t("history.kpi.fullDayCount.interpret")} />
              <KpiCard title={t("history.kpi.totalDays.title")} humanTitle={t("history.kpi.totalDays.human")} value={snapshot.totalDays} interpret={t("history.kpi.totalDays.interpret")} />
            </motion.div>
          </motion.section>

          {snapshot.weekday.best && snapshot.weekday.worst && snapshot.weekday.best.weekdayIndex !== snapshot.weekday.worst.weekdayIndex ? <motion.div variants={ITEM} className="rounded-2xl border border-white/[0.06] bg-zinc-900/35 px-5 py-4 text-sm text-zinc-300 transition duration-200 hover:bg-zinc-900/50">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                {t("history.weekPerspective")}
              </p>
              <p className="mt-2">
                {t("history.weekBetterLine", {
              day: formatWeekdayLong(snapshot.weekday.best.weekdayIndex, t),
              n: snapshot.weekday.best.avgProgress
            })}
              </p>
              <p className="mt-1 text-zinc-400">
                {t("history.weekWeakerLine", {
              day: formatWeekdayLong(snapshot.weekday.worst.weekdayIndex, t),
              n: snapshot.weekday.worst.avgProgress
            })}
              </p>
            </motion.div> : null}

          <div className="grid gap-6 lg:grid-cols-2">
            <ProgressBarsChart entries={sorted} formatDate={formatHistoryDate} />
            <ConsistencyHeatmap history={filteredHistory} variants={ITEM} goalColorId={goalId} />
          </div>

          {metaRows.length > 0 ? <MetaHorizontalBars rows={metaRows} t={t} onSelectGoal={row => {
          const deep = bundle.goalDeep.find(g => String(g.id) === String(row.id));
          setGoalModalRow(deep ?? row);
        }} /> : null}

          {snapshot.subtaskStats.length > 0 ? <motion.section variants={ITEM} className="space-y-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                  {t("history.subtasksSection")}
                </p>
                <p className="mt-1 text-sm text-zinc-300">
                  {t("history.subtasksHint")}
                </p>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="border-b border-white/[0.06] bg-zinc-900/50 text-[11px] uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">
                        {t("history.table.goal")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("history.table.subtask")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("history.table.times")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("history.table.rateOk")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {[...snapshot.subtaskStats].sort((a, b) => a.completionRate - b.completionRate).slice(0, 8).map(row => <tr key={`${row.goalId}|${row.label}`} className="text-zinc-300 transition-colors duration-200 hover:bg-white/[0.03]">
                          <td className="px-4 py-3 text-zinc-100">
                            {getLocalizedGoalTitle(row.goalId, row.goalTitle, t)}
                          </td>
                          <td className="px-4 py-3">
                            {localizeSubtaskLabel(row.goalId, row.label, t)}
                          </td>
                          <td className="px-4 py-3 tabular-nums">
                            {row.appearances}
                          </td>
                          <td className="px-4 py-3 tabular-nums">
                            {row.completionRate}%
                          </td>
                        </tr>)}
                  </tbody>
                </table>
              </div>
            </motion.section> : null}

          {metaRows.length > 0 ? <motion.section variants={ITEM} className="space-y-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                  {t("history.table.byGoal")}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  {t("history.table.byGoalHint")}
                </p>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-white/[0.06] bg-zinc-900/50 text-[11px] uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">
                        {t("history.table.goal")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("history.table.days")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("history.table.days100")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("history.table.rateOk")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("history.table.failRate")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("history.table.avgPct")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {metaRows.sort((a, b) => b.appearances - a.appearances).map(row => <tr key={row.id} className="text-zinc-300 transition-colors duration-200 hover:bg-white/[0.03]">
                          <td className="px-4 py-3 font-medium text-zinc-100">
                            {getLocalizedGoalTitle(String(row.id), row.title, t)}
                          </td>
                          <td className="px-4 py-3 tabular-nums">
                            {row.appearances}
                          </td>
                          <td className="px-4 py-3 tabular-nums">
                            {row.successes}
                          </td>
                          <td className="px-4 py-3 tabular-nums">{row.rate}%</td>
                          <td className="px-4 py-3 tabular-nums">
                            {row.failureRate}%
                          </td>
                          <td className="px-4 py-3 tabular-nums">
                            {row.avgPercent}%
                          </td>
                        </tr>)}
                  </tbody>
                </table>
              </div>
            </motion.section> : null}

          <motion.section variants={ITEM} className="space-y-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                {t("history.yourDays")}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                {t("history.yourDaysHint")}
              </p>
            </div>
            {sorted.length === 0 ? <p className="text-sm text-zinc-500">{t("history.emptyDays")}</p> : <ul className="space-y-2">
                {sorted.map(entry => {
              const isOpen = openDate === entry.date;
              return <li key={entry.date} className="overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/35 ring-1 ring-white/[0.04] transition hover:ring-white/[0.08]">
                      <motion.button type="button" onClick={() => setOpenDate(isOpen ? null : entry.date)} whileTap={{
                  scale: 0.995
                }} className={cn("flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left", "transition-colors duration-200 hover:bg-white/[0.04]", "interactive-press")}>
                        <span className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                          {isOpen ? <CaretDown className="h-4 w-4 shrink-0 text-zinc-500" /> : <CaretRight className="h-4 w-4 shrink-0 text-zinc-500" />}
                          <span className="capitalize">
                            {formatHistoryDate(entry.date)}
                          </span>
                        </span>
                        <span className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                          {entry.detail && !entry.detail.isLegacy && entry.detail.subtasksValidTotal != null ? <span>
                              {entry.detail.subtasksDoneTotal ?? 0}/
                              {entry.detail.subtasksValidTotal}{" "}
                              {t("history.dayList.subtasks")}
                            </span> : null}
                          <span className={cn("rounded-full px-2.5 py-0.5 font-medium tabular-nums", entry.completedFullDay ? "bg-emerald-500/15 text-emerald-300" : "bg-zinc-800 text-zinc-400")}>
                            {entry.percentComplete}%
                          </span>
                        </span>
                      </motion.button>
                      {isOpen ? <motion.div initial={{
                  opacity: 0,
                  height: 0
                }} animate={{
                  opacity: 1,
                  height: "auto"
                }} transition={{
                  duration: 0.28,
                  ease: [0.22, 1, 0.36, 1]
                }} className="border-t border-white/[0.05] px-4 pb-4 pt-2">
                          <DayDetailContent entry={entry} />
                        </motion.div> : null}
                    </li>;
            })}
              </ul>}
          </motion.section>

          <p className="pb-4 text-center text-[11px] text-zinc-600">
            {t("history.footerNote")}
          </p>

          <GoalDetailModal goalRow={goalModalRow} history={filteredHistory} onClose={() => setGoalModalRow(null)} />
        </motion.div>
      </main>
    </AppShell>;
}
