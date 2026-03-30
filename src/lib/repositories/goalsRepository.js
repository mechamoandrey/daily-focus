import {
  mergeGoalsWithTemplates,
  nextUserGoalOrder,
  normalizeSystemGoal,
  normalizeUserGoal,
  sortGoalsByOrder,
  SYSTEM_GOAL_IDS,
} from "@/lib/goalModel";
import { INITIAL_GOALS } from "@/data/initialGoals";

/**
 * Leitura de metas no estado persistido (sem I/O).
 * @param {import("@/lib/models/domain.js").DailyFocusPersistedState | null} state
 */
export function getGoals(state) {
  return state?.goals ?? [];
}

export function getGoalsSorted(state) {
  return sortGoalsByOrder(getGoals(state));
}

/**
 * Remove uma meta de utilizador (não-sistema).
 * @param {import("@/lib/models/domain.js").DailyFocusPersistedState} state
 * @param {string} goalId
 */
export function deleteGoal(state, goalId) {
  return {
    ...state,
    goals: mergeGoalsWithTemplates(
      state.goals.filter((g) => g.id !== goalId)
    ),
  };
}

/**
 * @param {import("@/lib/models/domain.js").DailyFocusPersistedState} state
 * @param {ReturnType<typeof normalizeUserGoal>} goalRecord
 */
export function saveGoal(state, goalRecord) {
  return {
    ...state,
    goals: mergeGoalsWithTemplates(
      state.goals.map((x) => (x.id === goalRecord.id ? goalRecord : x))
    ),
  };
}

/**
 * @param {import("@/lib/models/domain.js").DailyFocusPersistedState} state
 * @param {ReturnType<typeof normalizeUserGoal>} goalRecord
 */
export function saveNewGoal(state, goalRecord) {
  return {
    ...state,
    goals: mergeGoalsWithTemplates([...state.goals, goalRecord]),
  };
}

/**
 * @param {import("@/lib/models/domain.js").DailyFocusPersistedState} state
 * @param {string} templateId
 * @param {object} merged
 * @param {number} templateIndex
 */
export function updateSystemGoalFromTemplate(state, templateId, merged, templateIndex) {
  const template = INITIAL_GOALS.find((t) => t.id === templateId);
  if (!template || templateIndex < 0) return state;
  const updated = normalizeSystemGoal(template, merged, templateIndex);
  return {
    ...state,
    goals: mergeGoalsWithTemplates(
      state.goals.map((x) => (x.id === updated.id ? updated : x))
    ),
  };
}

export { nextUserGoalOrder, normalizeUserGoal, normalizeSystemGoal, SYSTEM_GOAL_IDS };
