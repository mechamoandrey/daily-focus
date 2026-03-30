"use client";

import { motion } from "framer-motion";
import { CheckCircle, Circle } from "@phosphor-icons/react";
import { MOTION_INTENSITY } from "@/constants/taste";
import { formatYMDLongLocalized } from "@/lib/dateUtils";
import { cn } from "@/lib/cn";
import { useLocale } from "@/providers/locale-provider";
export function HistoryPanel({
  entries,
  className
}) {
  const {
    t,
    locale
  } = useLocale();
  const list = Array.isArray(entries) ? entries : [];
  return <motion.section initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.45,
    delay: 0.04 * (MOTION_INTENSITY / 10),
    ease: [0.22, 1, 0.36, 1]
  }} className={cn("rounded-2xl border border-white/[0.06] bg-zinc-950/50 p-5 sm:p-6", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
            {t("panel.recentTitle")}
          </p>
          <p className="mt-1 text-sm text-zinc-400">{t("panel.recentSub")}</p>
        </div>
      </div>

      {list.length === 0 ? <p className="text-sm text-zinc-500">{t("panel.empty")}</p> : <ul className="max-h-[min(28rem,55vh)] divide-y divide-white/[0.05] overflow-y-auto pr-1 [scrollbar-color:rgba(255,255,255,0.12)_transparent] [scrollbar-width:thin]">
          {list.map(row => <li key={row.date} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-500">
                  {row.completedFullDay ? <CheckCircle className="h-4 w-4 text-emerald-400" weight="fill" /> : <Circle className="h-4 w-4 text-zinc-500" />}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium capitalize text-zinc-200">
                    {formatYMDLongLocalized(row.date, locale)}
                  </p>
                  <p className="text-xs text-zinc-500">{row.date}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums", row.completedFullDay ? "bg-emerald-500/15 text-emerald-300" : "bg-zinc-800 text-zinc-400")}>
                  {row.percentComplete}%
                </span>
              </div>
            </li>)}
        </ul>}
    </motion.section>;
}
