"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Eye,
  EyeSlash,
  LockSimple,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import { INITIAL_GOALS } from "@/data/initialGoals";
import {
  deleteGoal,
  getGoalsSorted,
  nextUserGoalOrder,
  normalizeUserGoal,
  saveGoal,
  saveNewGoal,
  SYSTEM_GOAL_IDS,
  updateSystemGoalFromTemplate,
} from "@/lib/repositories/goalsRepository";
import {
  emptyUserGoalDraft,
  normalizeSubtask,
} from "@/lib/goalModel";
import { computeGoalPercent } from "@/lib/progress";
import {
  ALL_WEEKDAY_KEYS,
  normalizeGoalVisibleDays,
  WEEKDAY_KEYS,
} from "@/lib/visibleDays";
import { cn } from "@/lib/cn";
import { useLocale } from "@/providers/locale-provider";
import {
  getLocalizedGoalTitle,
  resolveGoalDisplay,
} from "@/lib/i18n/goalDisplay";

const WEEKDAY_I18N_KEYS = {
  monday: "weekday.mon",
  tuesday: "weekday.tue",
  wednesday: "weekday.wed",
  thursday: "weekday.thu",
  friday: "weekday.fri",
  saturday: "weekday.sat",
  sunday: "weekday.sun",
};

function isoNow() {
  return new Date().toISOString();
}

export function BoxesManager({ stateApi }) {
  const { t } = useLocale();
  const { ready, state, setState, syncError, authLoading, bootLoading } =
    stateApi;
  const [mode, setMode] = useState(null);
  const [toast, setToast] = useState(null);

  const goalsSorted = useMemo(
    () => (state ? getGoalsSorted(state) : []),
    [state]
  );

  const userMetaCount = useMemo(
    () => goalsSorted.filter((g) => !g.isSystem).length,
    [goalsSorted]
  );

  const showToast = useCallback((message) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);

  const handleDelete = useCallback(
    (goal) => {
      if (goal.isSystem) return;
      const title = getLocalizedGoalTitle(goal.id, goal.title, t);
      const ok = window.confirm(t("goals.deleteConfirm", { title }));
      if (!ok) return;
      setState((prev) => {
        if (!prev) return prev;
        return deleteGoal(prev, goal.id);
      });
      showToast(t("goals.toast.removed"));
      setMode(null);
    },
    [setState, showToast, t]
  );

  if (syncError && !state && !authLoading && !bootLoading) {
    return (
      <div className="rounded-2xl border border-rose-500/25 bg-rose-500/[0.06] px-5 py-6 text-sm text-rose-100/95">
        <p>{syncError}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 cursor-pointer rounded-xl border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm text-zinc-200"
        >
          {t("goals.reload")}
        </button>
      </div>
    );
  }

  if (!ready || !state) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-zinc-800/80" />
        <div className="h-36 animate-pulse rounded-2xl bg-zinc-900/60" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
            {t("goals.orgLabel")}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
            {t("goals.pageTitle")}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
            {t("goals.intro")}
          </p>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() =>
            setMode({
              kind: "create",
              draft: emptyUserGoalDraft(),
            })
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_40px_-12px_rgba(139,92,246,0.65)] ring-1 ring-violet-400/30 transition hover:bg-violet-400"
        >
          <Plus className="h-4 w-4" weight="bold" />
          {t("goals.add")}
        </motion.button>
      </div>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] px-4 py-3 text-sm text-emerald-100/95"
          >
            <CheckCircle className="h-5 w-5 text-emerald-400" weight="fill" />
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {userMetaCount === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/35 px-5 py-4 text-sm text-zinc-400 ring-1 ring-white/[0.04]">
          {t("goals.emptyUser")}
        </div>
      ) : null}

      <ul className="grid gap-4 lg:grid-cols-2">
        {goalsSorted.map((g) => (
          <li key={g.id}>
            <BoxSummaryCard
              t={t}
              goal={g}
              onEdit={() =>
                setMode({
                  kind: "edit",
                  goalId: g.id,
                  draft: goalToDraft(g),
                })
              }
              onDelete={() => handleDelete(g)}
            />
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {mode ? (
          <BoxEditorOverlay
            key={
              mode.kind === "create" ? "create" : `edit-${mode.goalId}`
            }
            t={t}
            mode={mode}
            onClose={() => setMode(null)}
            onSave={(normalized) => {
              if (mode.kind === "create") {
                setState((prev) => {
                  if (!prev) return prev;
                  const id = crypto.randomUUID();
                  const order = nextUserGoalOrder(prev.goals);
                  const withMeta = normalizeUserGoal({
                    ...normalized,
                    id,
                    order,
                    createdAt: normalized.createdAt || isoNow(),
                    updatedAt: isoNow(),
                  });
                  return saveNewGoal(prev, withMeta);
                });
                showToast(t("goals.toast.created"));
              } else if (SYSTEM_GOAL_IDS.has(mode.goalId)) {
                const template = INITIAL_GOALS.find((t) => t.id === mode.goalId);
                const idx = INITIAL_GOALS.findIndex((t) => t.id === mode.goalId);
                if (template && idx >= 0) {
                  setState((prev) => {
                    if (!prev) return prev;
                    const existing = prev.goals.find((g) => g.id === mode.goalId);
                    const merged = {
                      ...existing,
                      ...normalized,
                      subtasks: normalized.subtasks,
                      updatedAt: isoNow(),
                    };
                    return updateSystemGoalFromTemplate(
                      prev,
                      mode.goalId,
                      merged,
                      idx
                    );
                  });
                  showToast(t("goals.toast.saved"));
                } else {
                  showToast(t("goals.toast.error"));
                }
              } else {
                setState((prev) => {
                  if (!prev) return prev;
                  const existing = prev.goals.find((g) => g.id === mode.goalId);
                  const updated = normalizeUserGoal({
                    ...normalized,
                    id: mode.goalId,
                    order:
                      typeof existing?.order === "number"
                        ? existing.order
                        : nextUserGoalOrder(prev.goals),
                    createdAt:
                      existing?.createdAt ||
                      normalized.createdAt ||
                      isoNow(),
                    updatedAt: isoNow(),
                  });
                  return saveGoal(prev, updated);
                });
                showToast(t("goals.toast.saved"));
              }
              setMode(null);
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** @param {any} goal */
function goalToDraft(goal) {
  const vd = normalizeGoalVisibleDays(goal.visibleDays);
  const allWeekdays =
    vd.length === ALL_WEEKDAY_KEYS.length &&
    ALL_WEEKDAY_KEYS.every((k) => vd.includes(k));
  return {
    title: goal.title,
    description: goal.description,
    category: goal.category || "",
    status: goal.status || "active",
    isVisible: goal.isVisible !== false,
    allWeekdays,
    visibleDays: vd,
    subtasks: (goal.subtasks || []).map((s) => ({
      id: s.id,
      label: s.label,
      done: Boolean(
        "completed" in s ? s.completed : "done" in s ? s.done : false
      ),
      createdAt: s.createdAt || isoNow(),
    })),
    createdAt: goal.createdAt,
  };
}

function BoxSummaryCard({ goal, onEdit, onDelete, t }) {
  const display = resolveGoalDisplay(goal, t);
  const pct = computeGoalPercent(goal);
  const subs = goal.subtasks?.length ?? 0;
  const daysHint = visibleDaysShortLabel(goal, t);

  return (
    <motion.article
      layout
      role="button"
      tabIndex={0}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onEdit}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit();
        }
      }}
      className={cn(
        "flex h-full w-full flex-col rounded-2xl border border-white/[0.07] bg-zinc-900/45 p-5 text-left ring-1 ring-white/[0.04] transition-opacity duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35",
        "cursor-pointer",
        goal.isSystem && "border-violet-500/15 bg-violet-950/20"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            {goal.isSystem ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-200/95">
                <LockSimple className="h-3 w-3" weight="bold" />
                {t("goals.system")}
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-200/90">
                {t("goals.yours")}
              </span>
            )}
            {goal.category ? (
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                {goal.category}
              </span>
            ) : null}
            {goal.isVisible === false ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-300/90">
                <EyeSlash className="h-3.5 w-3.5" />
                {t("goals.hiddenDash")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500">
                <Eye className="h-3.5 w-3.5" />
                {t("goals.visible")}
              </span>
            )}
          </div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-50">
            {display.title}
          </h2>
          {daysHint ? (
            <p className="text-[10px] text-zinc-500">{daysHint}</p>
          ) : null}
          <p className="line-clamp-2 text-sm text-zinc-400">
            {display.description}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            {t("goals.progress")}
          </p>
          <p className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-100">
            {pct}%
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4 text-[11px] text-zinc-500">
        <span>
          {subs}{" "}
          {subs === 1 ? t("goals.subtasks") : t("goals.subtasksPlural")} ·{" "}
          <span className="text-zinc-400">
            {goal.status === "archived" ? t("goals.archived") : t("goals.active")}
          </span>
        </span>
        {!goal.isSystem ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-rose-300/90 opacity-80 hover:bg-rose-500/10 hover:opacity-100"
            title={t("goals.form.deleteTitle")}
          >
            <Trash className="h-3.5 w-3.5" />
            <span className="sr-only">{t("goals.form.deleteTitle")}</span>
          </button>
        ) : null}
      </div>
    </motion.article>
  );
}

function visibleDaysShortLabel(goal, t) {
  const d = normalizeGoalVisibleDays(goal.visibleDays);
  if (d.length === 7) return t("goals.daysAll");
  if (d.length === 0) return "";
  return `${t("goals.daysPrefix")} ${d.map((k) => t(WEEKDAY_I18N_KEYS[k] ?? "weekday.mon")).join(" · ")}`;
}

function BoxEditorOverlay({ mode, onClose, onSave, t }) {
  const [draft, setDraft] = useState(() =>
    mode.kind === "create"
      ? mode.draft
      : { ...mode.draft, id: mode.goalId }
  );

  const updateSub = (id, label) => {
    setDraft((d) => ({
      ...d,
      subtasks: d.subtasks.map((s) =>
        s.id === id ? { ...s, label } : s
      ),
    }));
  };

  const addSub = () => {
    setDraft((d) => ({
      ...d,
      subtasks: [
        ...d.subtasks,
        {
          id: crypto.randomUUID(),
          label: "",
          done: false,
          createdAt: isoNow(),
        },
      ],
    }));
  };

  const removeSub = (id) => {
    setDraft((d) => ({
      ...d,
      subtasks: d.subtasks.filter((s) => s.id !== id),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = draft.title.trim();
    if (!title) {
      window.alert(t("goals.validation.title"));
      return;
    }
    const subs = draft.subtasks
      .map((s) =>
        normalizeSubtask(
          {
            ...s,
            label: s.label.trim() || t("goals.defaultSubtask"),
          },
          s.id
        )
      )
      .filter((s) => s.label.length > 0);
    if (subs.length === 0) {
      window.alert(t("goals.validation.subtasks"));
      return;
    }
    const visibleDays = draft.allWeekdays
      ? [...ALL_WEEKDAY_KEYS]
      : normalizeGoalVisibleDays(draft.visibleDays);

    onSave({
      title,
      description: draft.description.trim(),
      category: draft.category.trim() || null,
      status: draft.status,
      isVisible: draft.isVisible,
      visibleDays,
      subtasks: subs.map((s) => ({
        ...s,
        done: Boolean(s.done),
      })),
      createdAt: draft.createdAt || isoNow(),
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        aria-label={t("ui.close")}
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-h-[min(92vh,840px)] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-white/[0.08] bg-zinc-950 p-6 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.06] sm:rounded-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
              {mode.kind === "create"
                ? t("goals.form.create")
                : t("goals.form.edit")}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-50">
              {t("goals.form.subtitle")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
          >
            {t("ui.close")}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-zinc-400">
              {t("goals.form.titleLabel")}
            </span>
            <input
              required
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({ ...d, title: e.target.value }))
              }
              className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 outline-none ring-0 transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              placeholder={t("goals.form.titlePh")}
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-zinc-400">
              {t("goals.form.descLabel")}
            </span>
            <textarea
              value={draft.description}
              onChange={(e) =>
                setDraft((d) => ({ ...d, description: e.target.value }))
              }
              rows={3}
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              placeholder={t("goals.form.descPh")}
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-zinc-400">
              {t("goals.form.categoryLabel")}
            </span>
            <input
              value={draft.category}
              onChange={(e) =>
                setDraft((d) => ({ ...d, category: e.target.value }))
              }
              className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              placeholder={t("goals.form.categoryPh")}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-zinc-400">
                {t("goals.form.statusLabel")}
              </span>
              <select
                value={draft.status}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, status: e.target.value }))
                }
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              >
                <option value="active">{t("goals.active")}</option>
                <option value="archived">{t("goals.archived")}</option>
              </select>
            </label>
            <div className="flex flex-col justify-end gap-2 rounded-xl border border-white/[0.06] bg-zinc-900/40 px-3 py-2.5">
              <span className="text-xs font-medium text-zinc-400">
                {t("goals.form.visibleDash")}
              </span>
              <button
                type="button"
                onClick={() =>
                  setDraft((d) => ({ ...d, isVisible: !d.isVisible }))
                }
                className={cn(
                  "flex items-center justify-between rounded-lg px-2 py-2 text-sm transition",
                  draft.isVisible
                    ? "bg-emerald-500/15 text-emerald-100"
                    : "bg-zinc-800/80 text-zinc-400"
                )}
              >
                <span>
                  {draft.isVisible ? t("goals.form.yes") : t("goals.form.no")}
                </span>
                {draft.isVisible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeSlash className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-white/[0.06] bg-zinc-900/40 px-3 py-3">
            <span className="text-xs font-medium text-zinc-400">
              {t("goals.weekdaysTitle")}
            </span>
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={draft.allWeekdays}
                onChange={() =>
                  setDraft((d) => {
                    const next = !d.allWeekdays;
                    return {
                      ...d,
                      allWeekdays: next,
                      visibleDays: next
                        ? [...ALL_WEEKDAY_KEYS]
                        : d.visibleDays?.length
                          ? d.visibleDays
                          : ["monday"],
                    };
                  })
                }
                className="rounded border-white/20 bg-zinc-900 text-violet-400 focus:ring-violet-500/40"
              />
              <span className="text-sm text-zinc-200">
                {t("goals.allWeekdays")}
              </span>
            </label>
            {!draft.allWeekdays ? (
              <div className="flex flex-wrap gap-1.5">
                {WEEKDAY_KEYS.map((k) => {
                  const sel = normalizeGoalVisibleDays(draft.visibleDays).includes(
                    k
                  );
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() =>
                        setDraft((d) => {
                          const cur = normalizeGoalVisibleDays(d.visibleDays);
                          const set = new Set(cur);
                          if (set.has(k)) set.delete(k);
                          else set.add(k);
                          let next = WEEKDAY_KEYS.filter((x) => set.has(x));
                          if (next.length === 0) next = ["monday"];
                          const allOn =
                            next.length === ALL_WEEKDAY_KEYS.length &&
                            ALL_WEEKDAY_KEYS.every((dk) => next.includes(dk));
                          return {
                            ...d,
                            visibleDays: allOn ? [...ALL_WEEKDAY_KEYS] : next,
                            allWeekdays: allOn,
                          };
                        })
                      }
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-medium transition",
                        sel
                          ? "bg-violet-500/25 text-violet-100 ring-1 ring-violet-500/35"
                          : "bg-zinc-800/80 text-zinc-500 hover:bg-zinc-800"
                      )}
                    >
                      {t(WEEKDAY_I18N_KEYS[k])}
                    </button>
                  );
                })}
              </div>
            ) : null}
            <p className="text-[11px] leading-relaxed text-zinc-500">
              {t("goals.weekdaysHint")}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">
                {t("goals.form.subtasks")}
              </span>
              <button
                type="button"
                onClick={addSub}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-violet-300 hover:bg-violet-500/10"
              >
                <Plus className="h-3.5 w-3.5" weight="bold" />
                {t("goals.form.addSub")}
              </button>
            </div>
            <div className="space-y-2">
              {draft.subtasks.map((s) => (
                <div key={s.id} className="flex gap-2">
                  <input
                    value={s.label}
                    onChange={(e) => updateSub(s.id, e.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                    placeholder={t("goals.form.subPh")}
                  />
                  <button
                    type="button"
                    onClick={() => removeSub(s.id)}
                    disabled={draft.subtasks.length <= 1}
                    className="shrink-0 rounded-xl border border-transparent px-2 text-rose-300/90 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={t("goals.form.removeSub")}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.04]"
            >
              {t("goals.form.cancel")}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_40px_-12px_rgba(139,92,246,0.65)] ring-1 ring-violet-400/30 hover:bg-violet-400"
            >
              {t("goals.form.save")}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
