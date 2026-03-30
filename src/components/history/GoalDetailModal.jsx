"use client";

import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { getDetailGoals, goalProgress, sortedDesc } from "@/lib/analytics";
import { formatYMDLongLocalized } from "@/lib/dateUtils";
import { getLocalizedGoalTitle } from "@/lib/i18n/goalDisplay";
import { cn } from "@/lib/cn";
import { useLocale } from "@/providers/locale-provider";
export function GoalDetailModal({
  goalRow,
  history,
  onClose
}) {
  const {
    t,
    locale
  } = useLocale();
  const displayTitle = goalRow ? getLocalizedGoalTitle(String(goalRow.id), goalRow.title, t) : "";
  const recent = useMemo(() => {
    if (!goalRow || !history?.length) return [];
    const desc = sortedDesc(history);
    const out = [];
    for (const e of desc) {
      const g = getDetailGoals(e).find(x => String(x.id) === String(goalRow.id));
      if (g) out.push({
        date: e.date,
        g
      });
      if (out.length >= 10) break;
    }
    return out;
  }, [goalRow, history]);
  useEffect(() => {
    if (!goalRow || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [goalRow]);
  useEffect(() => {
    if (!goalRow) return;
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goalRow, onClose]);
  if (typeof document === "undefined") return null;
  return createPortal(<AnimatePresence mode="wait">
      {goalRow ? <motion.div key={goalRow.id} role="dialog" aria-modal="true" aria-labelledby="goal-detail-title" className="fixed inset-0 z-[85] flex items-end justify-center p-4 sm:items-center" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} transition={{
      duration: 0.2
    }}>
          <button type="button" className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-[2px]" aria-label={t("ui.close")} onClick={onClose} />
          <motion.div initial={{
        opacity: 0,
        y: 14,
        scale: 0.98
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        y: 10,
        scale: 0.98
      }} transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1]
      }} className="relative z-10 max-h-[min(85vh,680px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 shadow-2xl ring-1 ring-white/[0.06] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p id="goal-detail-title" className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                  {t("goalModal.title")}
                </p>
                <p className="mt-1 text-lg font-semibold text-zinc-50">
                  {displayTitle}
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  {t("goalModal.statsLine", {
                appearances: goalRow.appearances,
                rate: goalRow.completionRate,
                avg: goalRow.avgProgress
              })}
                </p>
                {goalRow.lastCompletedDate ? <p className="mt-1 text-xs text-emerald-400/90">
                    {t("goalModal.last100")}{" "}
                    {formatYMDLongLocalized(goalRow.lastCompletedDate, locale)}
                  </p> : null}
                {goalRow.lastFailedDate ? <p className="mt-0.5 text-xs text-amber-400/85">
                    {t("goalModal.lastOpen")}{" "}
                    {formatYMDLongLocalized(goalRow.lastFailedDate, locale)}
                  </p> : null}
              </div>
              <button type="button" onClick={onClose} className={cn("rounded-xl p-2 text-zinc-500 transition-colors duration-200", "hover:bg-white/[0.06] hover:text-zinc-200", "cursor-pointer interactive-press")} aria-label={t("ui.close")}>
                <X className="h-5 w-5" weight="bold" />
              </button>
            </div>
            <div className="mt-4 border-t border-white/[0.06] pt-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                {t("goalModal.recent")}
              </p>
              <ul className="mt-2 space-y-2 text-sm">
                {recent.map(({
              date,
              g
            }) => <li key={date} className="flex items-center justify-between gap-2 rounded-lg bg-zinc-900/50 px-3 py-2 text-zinc-300">
                    <span className="capitalize text-zinc-400">
                      {formatYMDLongLocalized(date, locale)}
                    </span>
                    <span className="tabular-nums text-zinc-200">
                      {goalProgress(g)}%
                      {g.completed ? <span className="ml-2 text-emerald-400/90">
                          {t("goalModal.statusOk")}
                        </span> : <span className="ml-2 text-amber-400/80">
                          {t("goalModal.statusOpen")}
                        </span>}
                    </span>
                  </li>)}
              </ul>
            </div>
          </motion.div>
        </motion.div> : null}
    </AnimatePresence>, document.body);
}
