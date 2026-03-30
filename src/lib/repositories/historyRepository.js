/**
 * Histórico persistido — sem I/O; preparado para futura sincronização por `userId`.
 * @param {import("@/lib/models/domain.js").DailyFocusPersistedState | null} state
 */
export function getHistory(state) {
  return state?.history ?? [];
}
