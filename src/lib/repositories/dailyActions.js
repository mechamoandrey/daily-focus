import { LINKEDIN_FRIDAY_META } from "@/data/linkedinFriday";

/**
 * Ações puras sobre o estado do dia (para o hook e futuros repositórios remotos).
 * @param {import("@/lib/models/domain.js").DailyFocusPersistedState | null} prev
 * @param {string} goalId
 * @param {string} subtaskId
 */
export function applyToggleSubtask(prev, goalId, subtaskId) {
  if (!prev) return prev;
  if (goalId === LINKEDIN_FRIDAY_META.id) {
    return {
      ...prev,
      linkedinFriday: {
        ...prev.linkedinFriday,
        subtasks: prev.linkedinFriday.subtasks.map((s) => {
          if (s.id !== subtaskId) return s;
          const next = !Boolean(s.done);
          return { ...s, done: next, completed: next };
        }),
      },
    };
  }
  return {
    ...prev,
    goals: prev.goals.map((g) =>
      g.id !== goalId
        ? g
        : {
            ...g,
            subtasks: g.subtasks.map((s) =>
              s.id !== subtaskId
                ? s
                : {
                    ...s,
                    done: !Boolean(s.done),
                    completed: !Boolean(s.done),
                  }
            ),
          }
    ),
  };
}
