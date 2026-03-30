"use client";

import { motion } from "framer-motion";
import { LinkedinLogo } from "@phosphor-icons/react";
import { MOTION_INTENSITY } from "@/constants/taste";
import { computeGoalPercent } from "@/lib/progress";
import { cn } from "@/lib/cn";
import { SubtaskItem } from "@/components/SubtaskItem";
import { useLocale } from "@/providers/locale-provider";
import { resolveLinkedInDisplay } from "@/lib/i18n/goalDisplay";
import { LINKEDIN_FRIDAY_META } from "@/data/linkedinFriday";
export function LinkedInFridayCard({
  goal,
  onToggle,
  index
}) {
  const {
    t
  } = useLocale();
  const display = resolveLinkedInDisplay(goal, t);
  const pct = computeGoalPercent(goal);
  return <motion.article layout initial={{
    opacity: 0,
    y: 14
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.42,
    delay: index * 0.06 * (MOTION_INTENSITY / 10),
    ease: [0.22, 1, 0.36, 1]
  }} className={cn("relative overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-950/50 to-zinc-950/90 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)] ring-1 ring-sky-500/10 transition-opacity duration-200 hover:opacity-[0.93] lg:col-span-2")}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sky-500/15 to-transparent opacity-90" />
      <div className="relative space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A66C2]/20 text-[#93C5FD] ring-1 ring-[#0A66C2]/20">
            <LinkedinLogo className="h-5 w-5" weight="fill" />
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-sky-400/80">
              {t("linkedin.dayLabel")}
            </p>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-50">
              {display.title}
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              {display.description}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            <span>{t("linkedin.checklistLabel")}</span>
            <span className="tabular-nums text-zinc-300">{pct}%</span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-zinc-800/90 ring-1 ring-white/[0.05]">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-[#0A66C2]" initial={{
            width: 0
          }} animate={{
            width: `${pct}%`
          }} transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1]
          }} />
          </div>
        </div>

        <div className="space-y-1.5">
          {display.subtasks.map(s => <SubtaskItem key={s.id} goalId={LINKEDIN_FRIDAY_META.id} subtask={s} onToggle={onToggle} />)}
        </div>
      </div>
    </motion.article>;
}
