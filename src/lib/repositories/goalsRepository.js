import { nextUserGoalOrder, normalizeSystemGoal, normalizeUserGoal, sortGoalsByOrder, SYSTEM_GOAL_IDS } from "@/lib/goalModel";
import { INITIAL_GOALS } from "@/data/initialGoals";
export function getGoals(state) {
  return state?.goals ?? [];
}
export function getGoalsSorted(state) {
  return sortGoalsByOrder(getGoals(state));
}
export function deleteGoal(state, goalId) {
  return {
    ...state,
    goals: sortGoalsByOrder(state.goals.filter(g => g.id !== goalId))
  };
}
export function saveGoal(state, goalRecord) {
  return {
    ...state,
    goals: sortGoalsByOrder(state.goals.map(x => x.id === goalRecord.id ? goalRecord : x))
  };
}
export function saveNewGoal(state, goalRecord) {
  return {
    ...state,
    goals: sortGoalsByOrder([...state.goals, goalRecord])
  };
}
export function updateSystemGoalFromTemplate(state, templateId, merged, templateIndex) {
  const template = INITIAL_GOALS.find(t => t.id === templateId);
  if (!template || templateIndex < 0) return state;
  const updated = normalizeSystemGoal(template, merged, templateIndex);
  return {
    ...state,
    goals: sortGoalsByOrder(state.goals.map(x => x.id === updated.id ? updated : x))
  };
}
export { nextUserGoalOrder, normalizeUserGoal, normalizeSystemGoal, SYSTEM_GOAL_IDS };
