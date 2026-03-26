"use client";

import { motion } from "framer-motion";
import { SubtaskItem } from "./SubtaskItem";
import { computeGoalPercent } from "@/lib/progress";
import { cn } from "@/lib/cn";

export function GoalCard({ goal, goalIndex, onToggleSubtask }) {
  const pct = computeGoalPercent(goal);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: goalIndex * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "flex flex-col rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-sm md:p-6",
        "transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
      )}
    >
      <div className="flex flex-col gap-4 border-b border-zinc-800/80 pb-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2 md:max-w-[70%]">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            Meta {goalIndex + 1}
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-zinc-50 md:text-xl">
            {goal.title}
          </h3>
          <p className="text-sm leading-relaxed text-zinc-500">{goal.description}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="text-2xl font-semibold tabular-nums text-zinc-100">
            {pct}
            <span className="text-sm font-medium text-zinc-500">%</span>
          </span>
          <span className="text-xs text-zinc-500">desta meta</span>
        </div>
      </div>

      <div className="pt-5">
        <div className="relative h-2 overflow-hidden rounded-full bg-zinc-800 ring-1 ring-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-teal-600/90 to-emerald-400/90"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 24 }}
          />
        </div>
      </div>

      <div className="mt-6 space-y-1.5">
        {goal.subtasks.map((s, i) => (
          <SubtaskItem
            key={s.id}
            index={i}
            title={s.title}
            done={s.done}
            onToggle={() => onToggleSubtask(goal.id, s.id)}
          />
        ))}
      </div>
    </motion.article>
  );
}
