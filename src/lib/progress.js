/**
 * Cálculos de progresso por meta e do dia inteiro.
 */

export function countSubtasks(goals) {
  return goals.reduce((acc, g) => acc + g.subtasks.length, 0);
}

export function countCompletedSubtasks(goals) {
  return goals.reduce(
    (acc, g) => acc + g.subtasks.filter((s) => s.done).length,
    0
  );
}

export function countCompletedGoals(goals) {
  return goals.filter((g) => {
    if (!g.subtasks.length) return false;
    return g.subtasks.every((s) => s.done);
  }).length;
}

/** Progresso 0–100 do dia (todas as subtarefas pesam igual). */
export function computeOverallPercent(goals) {
  const total = countSubtasks(goals);
  if (total === 0) return 0;
  return Math.round((countCompletedSubtasks(goals) / total) * 100);
}

export function computeGoalPercent(goal) {
  const n = goal.subtasks.length;
  if (n === 0) return 0;
  const done = goal.subtasks.filter((s) => s.done).length;
  return Math.round((done / n) * 100);
}

/**
 * Streak persistido = dias perfeitos consecutivos até ontem (após rollover).
 * Hoje completo soma +1 na exibição.
 */
export function getDisplayStreak(streak, todayPercent) {
  return streak + (todayPercent === 100 ? 1 : 0);
}
