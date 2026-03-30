"use client";

import { motion } from "framer-motion";
import { MOTION_INTENSITY } from "@/constants/taste";
import { computeGoalPercent } from "@/lib/progress";
import { cn } from "@/lib/cn";
import { SubtaskItem } from "@/components/SubtaskItem";
import { useLocale } from "@/providers/locale-provider";
import { resolveGoalDisplay } from "@/lib/i18n/goalDisplay";
const ACCENTS = ["from-violet-500/15 to-transparent", "from-fuchsia-500/12 to-transparent", "from-sky-500/12 to-transparent", "from-amber-500/12 to-transparent"];
export function GoalCard({
  goal,
  index,
  onToggle
}) {
  const {
    t
  } = useLocale();
  const display = resolveGoalDisplay(goal, t);
  const pct = computeGoalPercent(goal);
  const accent = ACCENTS[index % ACCENTS.length];
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
  }} className={cn("relative overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900/40 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.04] transition-opacity duration-200 hover:opacity-[0.93]")}>
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b opacity-90", accent)} />
      <div className="relative space-y-5 p-5 sm:p-6">
        <div className="space-y-2">
          {goal.category ? <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-violet-400/90">
              {goal.category}
            </p> : null}
          <h2 className="text-lg font-semibold tracking-tight text-zinc-50">
            {display.title}
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            {display.description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            <span>{t("goalCard.checklist")}</span>
            <span className="tabular-nums text-zinc-300">{pct}%</span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-zinc-800/90 ring-1 ring-white/[0.05]">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-indigo-400" initial={{
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
          {display.subtasks.map(s => <SubtaskItem key={s.id} goalId={goal.id} subtask={s} onToggle={onToggle} />)}
        </div>
      </div>
    </motion.article>;
}
