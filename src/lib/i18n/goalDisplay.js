import { INITIAL_GOALS } from "@/data/initialGoals";
import {
  INITIAL_LINKEDIN_SUBTASKS,
  LINKEDIN_FRIDAY_META,
} from "@/data/linkedinFriday";
import { SYSTEM_GOAL_IDS } from "@/lib/goalModel";

const TEMPLATE_BY_ID = new Map(INITIAL_GOALS.map((g) => [g.id, g]));
const LINKEDIN_GOAL_ID = LINKEDIN_FRIDAY_META.id;

function stripMatch(stored, seed) {
  return (stored ?? "").trim() === (seed ?? "").trim();
}

/**
 * @param {string} goalId
 * @param {string} storedTitle
 * @param {(k: string, vars?: Record<string, string | number>) => string} t
 */
export function getLocalizedGoalTitle(goalId, storedTitle, t) {
  if (goalId === LINKEDIN_GOAL_ID) {
    if (stripMatch(storedTitle, LINKEDIN_FRIDAY_META.title))
      return t("linkedin.meta.title");
    return storedTitle;
  }
  const tpl = TEMPLATE_BY_ID.get(goalId);
  if (!tpl || !SYSTEM_GOAL_IDS.has(goalId)) return storedTitle;
  if (stripMatch(storedTitle, tpl.title)) return t(`systemGoal.${goalId}.title`);
  return storedTitle;
}

/**
 * @param {string} goalId
 * @param {string} [storedDescription]
 * @param {(k: string, vars?: Record<string, string | number>) => string} t
 */
export function getLocalizedGoalDescription(goalId, storedDescription, t) {
  if (goalId === LINKEDIN_GOAL_ID) {
    if (stripMatch(storedDescription, LINKEDIN_FRIDAY_META.description))
      return t("linkedin.meta.description");
    return storedDescription ?? "";
  }
  const tpl = TEMPLATE_BY_ID.get(goalId);
  if (!tpl || !SYSTEM_GOAL_IDS.has(goalId)) return storedDescription ?? "";
  if (stripMatch(storedDescription, tpl.description))
    return t(`systemGoal.${goalId}.description`);
  return storedDescription ?? "";
}

/**
 * @param {string} goalId
 * @param {string} subtaskId
 * @param {string} storedLabel
 * @param {(k: string, vars?: Record<string, string | number>) => string} t
 */
export function getLocalizedSubtaskLabel(goalId, subtaskId, storedLabel, t) {
  if (!storedLabel) return storedLabel;
  if (goalId === LINKEDIN_GOAL_ID) {
    const li = INITIAL_LINKEDIN_SUBTASKS.find((s) => s.id === subtaskId);
    if (li && stripMatch(storedLabel, li.label))
      return t(`linkedin.sub.${subtaskId}.label`);
    return storedLabel;
  }
  const tplGoal = TEMPLATE_BY_ID.get(goalId);
  if (!tplGoal || !SYSTEM_GOAL_IDS.has(goalId)) return storedLabel;
  const sub = tplGoal.subtasks.find((s) => s.id === subtaskId);
  if (sub && subtaskId && stripMatch(storedLabel, sub.label))
    return t(`systemGoal.${goalId}.sub.${subtaskId}`);
  return storedLabel;
}

/**
 * Match by label only (analytics tables).
 * @param {string} goalId
 * @param {string} storedLabel
 * @param {(k: string, vars?: Record<string, string | number>) => string} t
 */
export function localizeSubtaskLabel(goalId, storedLabel, t) {
  if (!storedLabel) return storedLabel;
  if (goalId === LINKEDIN_GOAL_ID) {
    for (const s of INITIAL_LINKEDIN_SUBTASKS) {
      if (stripMatch(storedLabel, s.label))
        return t(`linkedin.sub.${s.id}.label`);
    }
    return storedLabel;
  }
  const tplGoal = TEMPLATE_BY_ID.get(goalId);
  if (!tplGoal || !SYSTEM_GOAL_IDS.has(goalId)) return storedLabel;
  for (const s of tplGoal.subtasks) {
    if (stripMatch(storedLabel, s.label))
      return t(`systemGoal.${goalId}.sub.${s.id}`);
  }
  return storedLabel;
}

/**
 * @param {string} goalId
 * @param {string} subtaskId
 * @param {string} [storedHint]
 * @param {(k: string, vars?: Record<string, string | number>) => string} t
 */
export function getLocalizedSubtaskHint(goalId, subtaskId, storedHint, t) {
  if (!storedHint) return storedHint;
  if (goalId === LINKEDIN_GOAL_ID) {
    const li = INITIAL_LINKEDIN_SUBTASKS.find((s) => s.id === subtaskId);
    if (li?.hint && stripMatch(storedHint, li.hint))
      return t(`linkedin.sub.${subtaskId}.hint`);
  }
  return storedHint;
}

/**
 * @param {unknown} goal
 * @param {(k: string, vars?: Record<string, string | number>) => string} t
 */
export function resolveGoalDisplay(goal, t) {
  const gid =
    goal && typeof goal === "object" && typeof goal.id === "string"
      ? goal.id
      : "";
  if (!gid) {
    return {
      title: String(goal?.title ?? ""),
      description: goal?.description ?? "",
      subtasks: Array.isArray(goal?.subtasks)
        ? goal.subtasks.map((s) => ({ ...s }))
        : [],
    };
  }
  const title = getLocalizedGoalTitle(gid, goal.title, t);
  const description = getLocalizedGoalDescription(gid, goal.description, t);
  const subtasks = (goal.subtasks ?? []).map((s) => ({
    ...s,
    label: getLocalizedSubtaskLabel(gid, s.id, s.label, t),
    hint: getLocalizedSubtaskHint(gid, s.id, s.hint, t),
  }));
  return { title, description, subtasks };
}

/**
 * @param {unknown} goal
 * @param {(k: string, vars?: Record<string, string | number>) => string} t
 */
export function resolveLinkedInDisplay(goal, t) {
  const gid = LINKEDIN_GOAL_ID;
  return {
    title: getLocalizedGoalTitle(gid, LINKEDIN_FRIDAY_META.title, t),
    description: getLocalizedGoalDescription(gid, LINKEDIN_FRIDAY_META.description, t),
    subtasks: (goal?.subtasks ?? []).map((s) => ({
      ...s,
      label: getLocalizedSubtaskLabel(gid, s.id, s.label, t),
      hint: getLocalizedSubtaskHint(gid, s.id, s.hint, t),
    })),
  };
}

/** @param {number} weekdayIndexMondayFirst 0=Mon … 6=Sun */
export function weekdayLongKey(weekdayIndexMondayFirst) {
  const keys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  return keys[weekdayIndexMondayFirst] ?? "mon";
}

/**
 * @param {number} weekdayIndexMondayFirst
 * @param {(k: string) => string} t
 */
export function formatWeekdayLong(weekdayIndexMondayFirst, t) {
  return t(`weekday.long.${weekdayLongKey(weekdayIndexMondayFirst)}`);
}
