export function getPreferences(state) {
  return state?.preferences ?? null;
}
export function patchPreferences(state, preferences) {
  if (preferences == null) {
    const {
      preferences: _p,
      ...rest
    } = state;
    return rest;
  }
  return {
    ...state,
    preferences
  };
}
