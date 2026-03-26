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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.42,
        delay: goalIndex * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "flex flex-col rounded-[1.25rem] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-sm)] backdrop-blur-[2px] md:rounded-[1.5rem] md:p-7",
        "transition-[box-shadow,transform] duration-300 hover:shadow-[var(--shadow-md)]",
        goalIndex % 2 === 1 && "lg:translate-y-5"
      )}
    >
      <div className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2 md:max-w-[72%]">
          <p className="text-xs font-medium text-[var(--muted)]">
            Meta {goalIndex + 1}
          </p>
          <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--foreground)] md:text-xl">
            {goal.title}
          </h3>
          <p className="max-w-[65ch] text-sm leading-relaxed text-[var(--muted)]">
            {goal.description}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="font-display text-3xl font-semibold tabular-nums text-[var(--foreground)]">
            {pct}
            <span className="ml-0.5 text-sm font-medium text-[var(--muted)]">%</span>
          </span>
          <span className="text-xs text-[var(--muted)]">nesta meta</span>
        </div>
      </div>

      <div className="pt-6">
        <div className="relative h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)] ring-1 ring-[var(--border)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)]"
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
