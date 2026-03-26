"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppSidebar } from "./AppSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DailyProgress } from "./DailyProgress";
import { GoalCard } from "./GoalCard";
import { StreakCard } from "./StreakCard";
import { HistoryPanel } from "./HistoryPanel";
import {
  applyDayResetIfNeeded,
  loadAppState,
  saveAppState,
} from "@/lib/storage";
import {
  computeOverallPercent,
  countCompletedGoals,
  countCompletedSubtasks,
  countSubtasks,
  getDisplayStreak,
} from "@/lib/progress";
import { formatDisplayDate, getLocalDateKey } from "@/lib/date";

export function DashboardApp() {
  const [state, setState] = useState(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setState(loadAppState());
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!state) return;
    saveAppState(state);
  }, [state]);

  useEffect(() => {
    const tick = () => {
      setState((prev) => {
        if (!prev) return prev;
        return applyDayResetIfNeeded(prev);
      });
    };
    const id = window.setInterval(tick, 60000);
    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const toggleSubtask = useCallback((goalId, subId) => {
    setState((prev) => {
      if (!prev) return prev;
      const goals = prev.goals.map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          subtasks: g.subtasks.map((s) =>
            s.id === subId ? { ...s, done: !s.done } : s
          ),
        };
      });
      return { ...prev, goals };
    });
  }, []);

  if (!state) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-950">
        <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-800 ring-2 ring-zinc-700/50" />
      </div>
    );
  }

  const todayKey = getLocalDateKey();
  const percent = computeOverallPercent(state.goals);
  const totalGoals = state.goals.length;
  const completedGoals = countCompletedGoals(state.goals);
  const totalSubtasks = countSubtasks(state.goals);
  const completedSubtasks = countCompletedSubtasks(state.goals);
  const dayComplete = percent === 100;
  const displayStreak = getDisplayStreak(state.streak, percent);

  return (
    <div className="flex min-h-dvh bg-zinc-950 text-zinc-100">
      <AppSidebar dateKey={todayKey} />

      <div className="relative flex flex-1 flex-col">
        <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]" />
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
          }}
        />

        <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-8 md:py-12 lg:max-w-6xl">
          <div className="flex flex-col gap-8 lg:gap-10">
            <DashboardHeader
              dateKey={todayKey}
              dateLabel={formatDisplayDate(todayKey)}
            />

            <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-start lg:gap-10">
              <div className="flex flex-col gap-8">
                <DailyProgress
                  percent={percent}
                  completedGoals={completedGoals}
                  totalGoals={totalGoals}
                  completedSubtasks={completedSubtasks}
                  totalSubtasks={totalSubtasks}
                  dayComplete={dayComplete}
                />

                <AnimatePresence mode="popLayout">
                  {dayComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden rounded-2xl border border-emerald-500/35 bg-emerald-500/10 px-5 py-4 text-center text-sm font-medium text-emerald-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    >
                      Dia completo. Parabéns — você fechou o plano de hoje.
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid gap-6">
                  {state.goals.map((g, i) => (
                    <GoalCard
                      key={g.id}
                      goal={g}
                      goalIndex={i}
                      onToggleSubtask={toggleSubtask}
                    />
                  ))}
                </div>

                <HistoryPanel entries={state.history} />
              </div>

              <div className="lg:sticky lg:top-10">
                <StreakCard displayStreak={displayStreak} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
