"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { getDayProgress } from "@/lib/analytics";
import {
  buildDayNarrative,
  dayPerformanceLabelKey,
} from "@/lib/historyHeatmapDay";
import { formatYMDFullLocalized } from "@/lib/dateUtils";
import { cn } from "@/lib/cn";
import { DayDetailContent } from "@/components/history/DayDetailContent";
import { useLocale } from "@/providers/locale-provider";

/** @param {{ entry: object | null, onClose: () => void }} props */
export function DayDetailModal({ entry, onClose }) {
  const { t, locale } = useLocale();

  useEffect(() => {
    if (!entry || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [entry]);

  useEffect(() => {
    if (!entry) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entry, onClose]);

  if (typeof document === "undefined") return null;

  const pct = entry ? getDayProgress(entry) : null;
  const narrative = entry ? buildDayNarrative(entry, t) : "";
  const dayClass =
    pct != null ? t(dayPerformanceLabelKey(pct)) : "";

  return createPortal(
    <AnimatePresence mode="wait">
      {entry ? (
        <motion.div
          key={entry.date}
          role="dialog"
          aria-modal="true"
          aria-labelledby="heatmap-day-modal-title"
          className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-[2px]"
            aria-label={t("ui.close")}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-h-[min(85vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 shadow-2xl ring-1 ring-white/[0.06] sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  id="heatmap-day-modal-title"
                  className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500"
                >
                  {t("dayModal.title")}
                </p>
                <p className="mt-1 text-lg font-semibold leading-snug text-zinc-50">
                  {formatYMDFullLocalized(entry.date, locale)}
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  {t("dayModal.progressLabel")}{" "}
                  <span className="font-medium tabular-nums text-zinc-200">
                    {pct}%
                  </span>
                  <span className="ml-2 text-zinc-500">· {dayClass}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  {narrative}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "rounded-xl p-2 text-zinc-500 transition-colors duration-200",
                  "hover:bg-white/[0.06] hover:text-zinc-200",
                  "cursor-pointer interactive-press"
                )}
                aria-label={t("ui.close")}
              >
                <X className="h-5 w-5" weight="bold" />
              </button>
            </div>
            <div className="mt-2">
              <DayDetailContent entry={entry} className="border-0 pt-0" />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
