/**
 * Preferências opcionais no estado persistido.
 * @param {import("@/lib/models/domain.js").DailyFocusPersistedState | null} state
 */
export function getPreferences(state) {
  return state?.preferences ?? null;
}

/**
 * @param {import("@/lib/models/domain.js").DailyFocusPersistedState} state
 * @param {import("@/lib/models/domain.js").UserPreferences | null} preferences
 */
export function patchPreferences(state, preferences) {
  if (preferences == null) {
    const { preferences: _p, ...rest } = state;
    return rest;
  }
  return { ...state, preferences };
}
