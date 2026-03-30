export function ensureGoalDomainFields(goal) {
  if (!goal || typeof goal !== "object") return goal;
  const gid = typeof goal.id === "string" && goal.id.length > 0 ? goal.id : undefined;
  const subs = Array.isArray(goal.subtasks) ? goal.subtasks : [];
  const subtasks = subs.filter(s => s && typeof s === "object").map(s => {
    const done = Boolean("completed" in s ? s.completed : "done" in s ? s.done : false);
    return {
      ...s,
      done,
      completed: done,
      ...(gid ? {
        goalId: s.goalId ?? gid
      } : {})
    };
  });
  return {
    ...goal,
    userId: goal.userId ?? null,
    subtasks
  };
}
