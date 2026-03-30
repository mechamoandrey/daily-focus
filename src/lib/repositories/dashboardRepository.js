/**
 * Vista agregada para o dashboard e analytics — sem I/O.
 * @param {import("@/lib/models/domain.js").DailyFocusPersistedState | null} state
 */
export function getDashboardData(state) {
  if (!state) return null;
  return {
    lastResetDate: state.lastResetDate,
    streak: state.streak,
    goals: state.goals,
    history: state.history,
    linkedinFriday: state.linkedinFriday,
    preferences: state.preferences ?? null,
  };
}
