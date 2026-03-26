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
    <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Progresso do dia
          </h2>
          <p className="text-2xl font-semibold tabular-nums tracking-tight text-zinc-100 md:text-3xl">
            {safe}
            <span className="text-lg font-medium text-zinc-500">%</span>
          </p>
          <p className="max-w-md text-sm text-zinc-500">
            {completedSubtasks} de {totalSubtasks} subtarefas · {completedGoals} de{" "}
            {totalGoals} metas fechadas
          </p>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-300",
            dayComplete
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : "border-zinc-700/80 bg-zinc-950/60 text-zinc-400"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              dayComplete ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" : "bg-zinc-600"
            )}
          />
          {dayComplete ? "Dia completo" : "Em progresso"}
        </div>
      </div>

      <div className="mt-8">
        <div className="relative h-3 overflow-hidden rounded-full bg-zinc-800/90 ring-1 ring-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-600/90 to-emerald-400/95"
            initial={false}
            animate={{ width: `${safe}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
          <motion.div
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent"
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
