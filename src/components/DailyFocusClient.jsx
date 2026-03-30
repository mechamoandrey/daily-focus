"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { DailyProgress } from "@/components/DailyProgress";
import { DashboardHeader } from "@/components/DashboardHeader";
import { GoalCard } from "@/components/GoalCard";
import { LinkedInFridayCard } from "@/components/LinkedInFridayCard";
import { StreakCard } from "@/components/StreakCard";
import { useDailyFocusState } from "@/hooks/useDailyFocusState";
import { frentesExecucaoTitle } from "@/lib/dashboardLabels";
import { linkedinForProgressOnDate } from "@/lib/goalModel";
import { formatYMDLongLocalized } from "@/lib/dateUtils";
import { countStats } from "@/lib/progress";
import { DataStateError } from "@/components/DataStateError";
import { useLocale } from "@/providers/locale-provider";
import { translateSyncError } from "@/lib/i18n/translateSyncError";
function ShellSkeleton() {
  return <AppShell>
      <main className="flex-1 px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-24 rounded-3xl bg-zinc-900/60" />
          <div className="h-40 rounded-3xl bg-zinc-900/60" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-64 rounded-2xl bg-zinc-900/60" />
            <div className="h-64 rounded-2xl bg-zinc-900/60" />
          </div>
        </div>
      </main>
    </AppShell>;
}
export function DailyFocusClient() {
  const {
    t,
    locale
  } = useLocale();
  const {
    ready,
    state,
    toggleSubtask,
    overallPercent,
    dayComplete,
    dashboardGoals,
    syncError,
    authLoading,
    bootLoading
  } = useDailyFocusState();
  if (syncError && !state && !authLoading && !bootLoading) {
    return <DataStateError message={syncError} />;
  }
  if (!ready || !state) {
    return <ShellSkeleton />;
  }
  const dayYmd = state.lastResetDate;
  const stats = countStats(state.goals, dayYmd, state.linkedinFriday);
  const linkedinToday = linkedinForProgressOnDate(state.linkedinFriday, dayYmd);
  const sectionHeading = frentesExecucaoTitle(stats.goalsTotal, t);
  const displayStreak = state.streak + (overallPercent === 100 ? 1 : 0);
  const todayBonus = overallPercent === 100;
  return <AppShell>
      <main className="flex-1 px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
        <div className="mx-auto max-w-5xl space-y-10">
            {syncError ? <p className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-2 text-center text-sm text-amber-100/95">
                {translateSyncError(syncError, t)}
              </p> : null}
            <DashboardHeader dayComplete={dayComplete} dateLabel={formatYMDLongLocalized(dayYmd, locale)} visibleGoalsCount={stats.goalsTotal} overallPercent={overallPercent} />

            <DailyProgress percent={overallPercent} subDone={stats.subDone} subTotal={stats.subTotal} goalsComplete={stats.goalsComplete} goalsTotal={stats.goalsTotal} dayComplete={dayComplete} />

            <StreakCard archivedStreak={state.streak} todayBonus={todayBonus} displayStreak={displayStreak} />

            <section className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    {t("dashboard.goalsToday")}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-50">
                    {sectionHeading}
                  </h2>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {stats.goalsTotal === 0 ? <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/[0.06] bg-zinc-900/30 px-6 py-12 text-center lg:col-span-2">
                    <p className="max-w-md text-sm leading-relaxed text-zinc-400">
                      {t("dashboard.emptyGoalsHint")}
                    </p>
                    <Link href="/goals" className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_40px_-12px_rgba(139,92,246,0.65)] ring-1 ring-violet-400/30 transition hover:bg-violet-400">
                      {t("dashboard.createGoalCta")}
                    </Link>
                  </div> : <AnimatePresence mode="popLayout">
                    {dashboardGoals.map((g, i) => <GoalCard key={g.id} goal={g} index={i} onToggle={toggleSubtask} />)}
                    {linkedinToday ? <LinkedInFridayCard key="linkedin-friday" goal={state.linkedinFriday} index={dashboardGoals.length} onToggle={toggleSubtask} /> : null}
                  </AnimatePresence>}
              </div>
            </section>

            <AnimatePresence>
              {dayComplete && <motion.div initial={{
            opacity: 0,
            y: 12
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: 8
          }} transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1]
          }} className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] px-5 py-4 text-center text-sm text-emerald-100/95">
                  {t("dashboard.dayDone")}
                </motion.div>}
            </AnimatePresence>

            <p className="pb-6 text-center text-[11px] text-zinc-600">
              {t("dashboard.streakFooter")}
            </p>
        </div>
      </main>
    </AppShell>;
}
