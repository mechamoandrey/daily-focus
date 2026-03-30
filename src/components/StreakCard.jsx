"use client";

import { motion } from "framer-motion";
import { Flame } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { useLocale } from "@/providers/locale-provider";
export function StreakCard({
  archivedStreak,
  todayBonus,
  displayStreak,
  className
}) {
  const {
    t
  } = useLocale();
  const subLine = displayStreak === 0 ? t("streak.sub0") : displayStreak === 1 ? t("streak.sub1") : t("streak.subN");
  const footer = todayBonus ? t("streak.todayCounts") : archivedStreak > 0 ? t("streak.extend") : t("streak.start");
  return <motion.div initial={{
    opacity: 0,
    y: 8
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1]
  }} className={cn("rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/[0.09] to-zinc-950/40 p-5 ring-1 ring-orange-500/10", className)}>
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/25">
          <Flame className="h-6 w-6" weight="fill" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-orange-200/70">
            {t("streak.title")}
          </p>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-semibold tabular-nums tracking-tight text-zinc-50">
              {displayStreak}
            </span>
            <span className="text-sm text-zinc-400">{subLine}</span>
          </div>
          <p className="text-xs leading-relaxed text-zinc-500">{footer}</p>
        </div>
      </div>
    </motion.div>;
}
