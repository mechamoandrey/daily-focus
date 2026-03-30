"use client";

import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { getDayProgress, sortedAsc } from "@/lib/analytics";
import { getGoalPercentInEntry, getHeatmapDaySummary } from "@/lib/historyHeatmapDay";
import { HeatmapTooltip } from "@/components/history/HeatmapTooltip";
import { DayDetailModal } from "@/components/history/DayDetailModal";
import { cn } from "@/lib/cn";
import { useLocale } from "@/providers/locale-provider";
function cellVisual(entry, goalColorId) {
  if (!entry) return "bg-zinc-950/90 ring-zinc-800/70";
  let p;
  if (goalColorId) {
    const gp = getGoalPercentInEntry(entry, goalColorId);
    if (gp == null) {
      return "bg-zinc-900/55 ring-zinc-700/40 opacity-75";
    }
    p = gp;
  } else {
    p = getDayProgress(entry);
  }
  if (p === 100) return "bg-emerald-500/90 ring-emerald-400/50";
  if (p >= 70) return "bg-indigo-500/60 ring-indigo-400/45";
  if (p >= 30) return "bg-amber-500/50 ring-amber-400/38";
  if (p >= 1) return "bg-rose-500/45 ring-rose-400/38";
  return "bg-zinc-800/95 ring-zinc-600/55";
}
export function ConsistencyHeatmap({
  history,
  variants,
  goalColorId
}) {
  const {
    t
  } = useLocale();
  const [hover, setHover] = useState(null);
  const [modalEntry, setModalEntry] = useState(null);
  const cells = useMemo(() => {
    const asc = sortedAsc(history);
    const raw = asc.slice(-35);
    const pad = Math.max(0, 35 - raw.length);
    return [...Array(pad).fill(null), ...raw];
  }, [history]);
  const tooltipSummary = useMemo(() => hover ? getHeatmapDaySummary(hover.entry, {
    goalId: goalColorId
  }) : null, [hover, goalColorId]);
  const showTooltip = Boolean(hover && tooltipSummary);
  const handlePointerEnter = useCallback((entry, el) => {
    if (!el) return;
    setHover({
      entry,
      rect: el.getBoundingClientRect()
    });
  }, []);
  const handlePointerLeave = useCallback(() => {
    setHover(null);
  }, []);
  const handleOpen = useCallback(entry => {
    if (!entry) return;
    setHover(null);
    setModalEntry(entry);
  }, []);
  const handleCloseModal = useCallback(() => setModalEntry(null), []);
  return <motion.div variants={variants} className="rounded-2xl border border-white/[0.06] bg-zinc-950/40 p-5 sm:p-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
        {t("heatmap.title")}
      </p>
      <p className="mt-1 text-sm text-zinc-300">
        {goalColorId ? t("heatmap.hintGoalFilter") : t("heatmap.hintDefault")}
      </p>
      <div className="relative mt-4 grid w-full grid-cols-7 gap-1.5 sm:gap-2">
        {cells.map((entry, i) => {
        const label = entry ? t("heatmap.ariaDay", {
          date: entry.date,
          pct: getDayProgress(entry)
        }) : t("heatmap.slotEmpty");
        const commonHandlers = {
          onMouseEnter: e => handlePointerEnter(entry, e.currentTarget),
          onMouseLeave: handlePointerLeave
        };
        if (entry) {
          return <motion.button key={entry.date} type="button" {...commonHandlers} onFocus={e => handlePointerEnter(entry, e.currentTarget)} onBlur={handlePointerLeave} onClick={() => handleOpen(entry)} whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.97
          }} transition={{
            duration: 0.18
          }} aria-label={label} className={cn("aspect-square rounded-md ring-1 transition duration-200", "outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60", "cursor-pointer hover:ring-white/25 hover:brightness-110", cellVisual(entry, goalColorId))} />;
        }
        return <motion.div key={`pad-${i}`} role="gridcell" {...commonHandlers} aria-label={label} className={cn("aspect-square rounded-md ring-1 transition duration-200", "cursor-default opacity-90", cellVisual(null, null))} />;
      })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-emerald-500/90 ring-1 ring-emerald-400/50" />
          {t("heatmap.legend.full")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-indigo-500/60 ring-1 ring-indigo-400/45" />
          {t("heatmap.legend.good")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-amber-500/50 ring-1 ring-amber-400/38" />
          {t("heatmap.legend.partial")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-rose-500/45 ring-1 ring-rose-400/38" />
          {t("heatmap.legend.low")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-zinc-800/95 ring-1 ring-zinc-600/55" />
          {t("heatmap.legend.zero")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-zinc-950/90 ring-1 ring-zinc-800/70" />
          {t("heatmap.legend.empty")}
        </span>
      </div>

      <HeatmapTooltip visible={showTooltip} anchorRect={hover?.rect ?? null} summary={tooltipSummary} />
      <DayDetailModal entry={modalEntry} onClose={handleCloseModal} />
    </motion.div>;
}
