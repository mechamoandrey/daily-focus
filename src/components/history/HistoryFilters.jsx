"use client";

import { cn } from "@/lib/cn";
import { useLocale } from "@/providers/locale-provider";
import { PERIOD_ALL, PERIOD_OPTIONS } from "@/lib/historyFilters";

/**
 * @param {{
 *   period: string,
 *   onPeriod: (v: string) => void,
 *   goalId: string | null,
 *   onGoal: (v: string | null) => void,
 *   goalOptions: { id: string, label: string }[],
 * }} props
 */
export function HistoryFilters({
  period,
  onPeriod,
  goalId,
  onGoal,
  goalOptions,
}) {
  const { t } = useLocale();

  return (
    <div
      className={cn(
        "flex flex-wrap items-end gap-4 rounded-2xl border border-white/[0.06] bg-zinc-900/35 px-4 py-3 ring-1 ring-white/[0.04]",
        "transition hover:bg-zinc-900/50"
      )}
    >
      <label className="flex min-w-[140px] flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          {t("dashboard.filters.period")}
        </span>
        <select
          value={period}
          onChange={(e) => onPeriod(e.target.value)}
          className={cn(
            "cursor-pointer rounded-xl border border-white/[0.08] bg-zinc-950/80 px-3 py-2 text-sm text-zinc-200",
            "outline-none transition hover:border-white/[0.12] focus-visible:ring-2 focus-visible:ring-violet-500/40"
          )}
        >
          {PERIOD_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.value === PERIOD_ALL
                ? t("period.all")
                : t(`period.${o.value}`)}
            </option>
          ))}
        </select>
      </label>
      <label className="flex min-w-[180px] flex-1 flex-col gap-1 sm:max-w-xs">
        <span
          className="text-[10px] font-medium uppercase tracking-wider text-zinc-500"
          title={t("dashboard.filters.goalHelp")}
        >
          {t("dashboard.filters.goal")}
        </span>
        <select
          value={goalId ?? "all"}
          onChange={(e) =>
            onGoal(e.target.value === "all" ? null : e.target.value)
          }
          className={cn(
            "cursor-pointer rounded-xl border border-white/[0.08] bg-zinc-950/80 px-3 py-2 text-sm text-zinc-200",
            "outline-none transition hover:border-white/[0.12] focus-visible:ring-2 focus-visible:ring-violet-500/40"
          )}
        >
          {goalOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
