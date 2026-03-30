"use client";

import { cn } from "@/lib/cn";
import { getLocalizedGoalTitle, localizeSubtaskLabel } from "@/lib/i18n/goalDisplay";
import { useLocale } from "@/providers/locale-provider";
export function DayDetailContent({
  entry,
  className
}) {
  const {
    t
  } = useLocale();
  const d = entry?.detail;
  if (!d || d.isLegacy) {
    return <p className="text-sm text-zinc-500">{t("dayDetail.legacy")}</p>;
  }
  return <div className={cn("space-y-4", className ?? "border-t border-white/[0.06] pt-4")}>
      <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
        {d.subtasksValidTotal != null ? <span>
            {t("dayDetail.subtasks")}{" "}
            {d.subtasksDoneTotal ?? "—"} / {d.subtasksValidTotal}
          </span> : null}
        {d.goalsTotalCount != null ? <span>
            {t("dayDetail.goalsDone")}{" "}
            {d.goalsCompleteCount ?? "—"} / {d.goalsTotalCount}{" "}
            {t("dayDetail.goalsDoneSuffix")}
          </span> : null}
      </div>
      <ul className="space-y-3">
        {(d.goals || []).map(g => <li key={`${entry.date}-${g.id}`} className="rounded-xl border border-white/[0.06] bg-zinc-900/35 px-4 py-3 transition hover:bg-zinc-900/50">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-zinc-100">
                {getLocalizedGoalTitle(String(g.id), g.title, t)}
              </span>
              <span className="tabular-nums text-sm text-zinc-400">
                {g.goalPercent ?? 0}%
                {g.completed ? <span className="ml-2 text-emerald-400">{t("dayDetail.done")}</span> : <span className="ml-2 text-amber-400/90">
                    {t("dayDetail.pending")}
                  </span>}
              </span>
            </div>
            <div className="mt-2 grid gap-2 text-xs text-zinc-500 sm:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                  {t("dayDetail.completedCol")}
                </p>
                <p className="text-zinc-400">
                  {(g.subtasksCompletedLabels || []).map(lab => localizeSubtaskLabel(String(g.id), lab, t)).join(" · ") || "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                  {t("dayDetail.pendingCol")}
                </p>
                <p className="text-zinc-400">
                  {(g.subtasksPendingLabels || []).map(lab => localizeSubtaskLabel(String(g.id), lab, t)).join(" · ") || "—"}
                </p>
              </div>
            </div>
          </li>)}
      </ul>
    </div>;
}
