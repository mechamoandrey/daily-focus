"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function DailyProgress({
  percent,
  completedGoals,
  totalGoals,
  completedSubtasks,
  totalSubtasks,
  dayComplete,
}) {
  const safe = Math.min(100, Math.max(0, percent));

  return (
    <section
      aria-labelledby="daily-progress-heading"
      className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-sm)] md:rounded-[1.5rem] md:p-9"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2 text-left">
          <h2
            id="daily-progress-heading"
            className="text-sm font-medium italic text-[var(--muted)]"
          >
            Progresso do dia
          </h2>
          <p className="font-display text-4xl font-semibold tabular-nums tracking-tight text-[var(--foreground)] md:text-5xl">
            {safe}
            <span className="ml-0.5 text-2xl font-medium text-[var(--muted)]">%</span>
          </p>
          <p className="max-w-md text-pretty text-sm leading-relaxed text-[var(--muted)]">
            {completedSubtasks} de {totalSubtasks} subtarefas · {completedGoals} de {totalGoals}{" "}
            metas concluídas
          </p>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 self-start rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-300 lg:self-auto",
            dayComplete
              ? "border-[var(--accent)]/35 bg-[var(--accent-muted)] text-[var(--accent-bright)]"
              : "border-[var(--border)] bg-[var(--bg-base)]/80 text-[var(--muted)]"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              dayComplete ? "bg-[var(--accent-bright)] shadow-[0_0_14px_var(--accent-glow)]" : "bg-[var(--muted)]"
            )}
          />
          {dayComplete ? "Dia completo" : "Em progresso"}
        </div>
      </div>

      <div className="mt-9">
        <div className="relative h-3 overflow-hidden rounded-full bg-[var(--bg-elevated)] ring-1 ring-[var(--border)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)]"
            initial={false}
            animate={{ width: `${safe}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
          <motion.div
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/12 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: safe > 5 ? "200%" : "-100%" }}
            transition={{
              duration: 2.2,
              repeat: safe >= 100 ? 0 : Infinity,
              repeatDelay: 1,
              ease: "linear",
            }}
          />
        </div>
      </div>
    </section>
  );
}
