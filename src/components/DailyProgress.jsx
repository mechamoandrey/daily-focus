"use client";

import { motion } from "framer-motion";
import { MOTION_INTENSITY } from "@/constants/taste";
import { cn } from "@/lib/cn";
import { useLocale } from "@/providers/locale-provider";
export function DailyProgress({
  percent,
  subDone,
  subTotal,
  goalsComplete,
  goalsTotal,
  dayComplete,
  className
}) {
  const {
    t
  } = useLocale();
  const motionT = 0.45 + MOTION_INTENSITY * 0.02;
  return <motion.section initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: motionT,
    ease: [0.22, 1, 0.36, 1]
  }} className={cn("rounded-3xl border border-white/[0.07] bg-gradient-to-br from-zinc-900/90 to-zinc-950/95 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] sm:p-8", className)}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
            {t("dashboard.dailyProgressTitle")}
          </p>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-5xl font-semibold tabular-nums tracking-tight text-zinc-50 sm:text-6xl">
              {percent}
              <span className="text-2xl text-zinc-500 sm:text-3xl">%</span>
            </span>
            {dayComplete && <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                {t("dashboard.dayCompleteBadge")}
              </span>}
          </div>
          <p className="max-w-md text-sm leading-relaxed text-zinc-400">
            {t("dashboard.subtasksProgressLine", {
            subDone,
            subTotal,
            goalsComplete,
            goalsTotal
          })}
          </p>
        </div>

        <div className="flex gap-8 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-zinc-500">
              {t("dashboard.subtasksLabel")}
            </p>
            <p className="mt-1 text-2xl font-medium tabular-nums text-zinc-100">
              {subDone}
              <span className="text-zinc-500">/{subTotal}</span>
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-zinc-500">
              {t("dashboard.goalsClosedLabel")}
            </p>
            <p className="mt-1 text-2xl font-medium tabular-nums text-zinc-100">
              {goalsComplete}
              <span className="text-zinc-500">/{goalsTotal}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="relative h-3 overflow-hidden rounded-full bg-zinc-800/80 ring-1 ring-white/[0.06]">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-400" initial={{
          width: 0
        }} animate={{
          width: `${percent}%`
        }} transition={{
          duration: 0.85,
          ease: [0.22, 1, 0.36, 1]
        }} />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)] opacity-40" />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-zinc-500">
          <span>{t("dashboard.executionBar")}</span>
          <span className="tabular-nums">{t("dashboard.target100")}</span>
        </div>
      </div>
    </motion.section>;
}
