"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppTopNav } from "./AppTopNav";
import { SiteFooter } from "./SiteFooter";
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

function LoadingShell() {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg-base)]">
      <div className="h-16 animate-pulse border-b border-[var(--border)] bg-[var(--bg-elevated)]/50" />
      <div className="mx-auto w-full max-w-[1320px] flex-1 space-y-8 px-4 py-10 md:px-8">
        <div className="h-40 animate-pulse rounded-[1.75rem] bg-[var(--bg-elevated)]/60" />
        <div className="h-36 animate-pulse rounded-[1.5rem] bg-[var(--bg-elevated)]/50" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-[1.5rem] bg-[var(--bg-elevated)]/45" />
          <div className="h-72 animate-pulse rounded-[1.5rem] bg-[var(--bg-elevated)]/45" />
        </div>
      </div>
    </div>
  );
}

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
    return <LoadingShell />;
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
    <div className="flex min-h-dvh flex-col bg-[var(--bg-base)] text-[var(--foreground)]">
      <AppTopNav dateKey={todayKey} />

      <div className="relative flex flex-1 flex-col">
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-15%,rgba(62,154,138,0.11),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.4]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />

        <main
          id="conteudo-principal"
          className="relative z-10 mx-auto w-full max-w-[1320px] flex-1 px-4 py-8 md:px-8 md:py-11"
        >
          <div className="flex flex-col gap-9 md:gap-11">
            <DashboardHeader
              dateKey={todayKey}
              dateLabel={formatDisplayDate(todayKey)}
            />

            <div className="grid gap-9 lg:grid-cols-[1fr_min(320px,36%)] lg:items-start lg:gap-10">
              <div className="flex flex-col gap-9">
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
                      role="status"
                      className="overflow-hidden rounded-[1.25rem] border border-[var(--accent)]/30 bg-[var(--accent-muted)] px-5 py-4 text-center text-sm font-medium text-[var(--accent-bright)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                    >
                      Plano do dia concluído. Tudo que era para hoje está feito.
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid gap-7 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-6">
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

              <div className="lg:sticky lg:top-24">
                <StreakCard displayStreak={displayStreak} />
              </div>
            </div>
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
