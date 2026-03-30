export function getDashboardData(state) {
  if (!state) return null;
  return {
    lastResetDate: state.lastResetDate,
    streak: state.streak,
    goals: state.goals,
    history: state.history,
    linkedinFriday: state.linkedinFriday,
    preferences: state.preferences ?? null
  };
}
