"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatYMDFullLocalized } from "@/lib/dateUtils";
import { cn } from "@/lib/cn";
import { useLocale } from "@/providers/locale-provider";
export function HeatmapTooltip({
  visible,
  anchorRect,
  summary
}) {
  const {
    t,
    locale
  } = useLocale();
  const elRef = useRef(null);
  const [pos, setPos] = useState({
    top: 0,
    left: 0
  });
  useLayoutEffect(() => {
    if (!visible || !anchorRect || !summary || !elRef.current) return;
    const el = elRef.current;
    const tw = el.offsetWidth;
    const th = el.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 8;
    const cx = anchorRect.left + anchorRect.width / 2;
    let top = anchorRect.top - th - margin;
    let left = cx - tw / 2;
    if (top < margin) {
      top = anchorRect.bottom + margin;
    }
    left = Math.max(margin, Math.min(left, vw - tw - margin));
    if (top + th > vh - margin) {
      top = Math.max(margin, vh - th - margin);
    }
    setPos({
      top,
      left
    });
  }, [visible, anchorRect, summary]);
  if (typeof document === "undefined") return null;
  const dateFull = summary?.dateYmd != null ? formatYMDFullLocalized(summary.dateYmd, locale) : "";
  return createPortal(<AnimatePresence>
      {visible && summary && anchorRect ? <motion.div ref={elRef} key={`${summary.kind}-${summary.dateYmd ?? "e"}`} role="tooltip" initial={{
      opacity: 0,
      y: 6
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: 4
    }} transition={{
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1]
    }} style={{
      top: pos.top,
      left: pos.left
    }} className={cn("pointer-events-none fixed z-[65] w-[min(18rem,calc(100vw-1.5rem))]", "rounded-xl border border-white/[0.1] bg-zinc-950/95 px-3 py-3 text-left shadow-xl", "ring-1 ring-white/[0.06] backdrop-blur-md")}>
          {summary.kind === "empty" ? <p className="text-sm text-zinc-300">{t("heatmap.slotEmpty")}</p> : summary.kind === "no_goal_day" ? <>
              <p className="text-xs font-medium leading-snug text-zinc-100">
                {dateFull}
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                {t("heatmap.goalNotVisible")}
              </p>
              <p className="mt-1 text-[11px] text-zinc-500">
                {t("heatmap.goalInactive")}
              </p>
            </> : summary.kind === "goal" ? <>
              <p className="text-xs font-medium leading-snug text-zinc-100">
                {dateFull}
              </p>
              {summary.percent != null ? <p className="mt-2 text-2xl font-semibold tabular-nums text-violet-300">
                  {summary.percent}%
                </p> : null}
              <p className="mt-1 text-[11px] text-zinc-500">
                {t(`heatmap.status.${summary.statusBand}`)}
              </p>
              <div className="mt-3 space-y-1 border-t border-white/[0.06] pt-2 text-[11px] text-zinc-400">
                <p>
                  {summary.goalTitle}: {summary.percent}%
                </p>
                <p>
                  {summary.goalClosed ? t("heatmap.goalClosed") : t("heatmap.goalOpen")}
                </p>
              </div>
            </> : <>
              <p className="text-xs font-medium leading-snug text-zinc-100">
                {dateFull}
              </p>
              {summary.percent != null ? <p className="mt-2 text-2xl font-semibold tabular-nums text-violet-300">
                  {summary.percent}%
                </p> : null}
              <p className="mt-1 text-[11px] text-zinc-500">
                {t(`heatmap.status.${summary.statusBand}`)}
              </p>
              <div className="mt-3 space-y-1 border-t border-white/[0.06] pt-2 text-[11px] text-zinc-400">
                <p>
                  {t("heatmap.tooltipGoals")}{" "}
                  {summary.legacyDetail ? t("heatmap.legacyGoals") : summary.goalsComplete != null && summary.goalsTotal != null ? t("heatmap.goalsLine", {
              done: summary.goalsComplete,
              total: summary.goalsTotal
            }) : "—"}
                </p>
                <p>
                  {t("heatmap.tooltipSubs")}{" "}
                  {summary.legacyDetail ? t("heatmap.legacyGoals") : summary.subtasksDone != null && summary.subtasksTotal != null ? t("heatmap.subsLine", {
              done: summary.subtasksDone,
              total: summary.subtasksTotal
            }) : "—"}
                </p>
              </div>
            </>}
        </motion.div> : null}
    </AnimatePresence>, document.body);
}
