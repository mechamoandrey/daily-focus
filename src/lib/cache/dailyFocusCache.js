/**
 * Read-through cache for remote state (per user, timestamped).
 * Writes only mirror successful remote reads or explicit user saves — never seeds the database.
 * Supabase is the sole source of truth for persisted data.
 */

import { STORAGE_KEY as LEGACY_BLOB_KEY } from "@/lib/storageKeys";

const PREFIX = "daily-focus:v1:state:";

/**
 * @param {string} userId
 */
function keyFor(userId) {
  return `${PREFIX}${userId}`;
}

/**
 * @param {string} userId
 * @returns {{ state: import("@/lib/models/domain.js").DailyFocusPersistedState, updatedAt: number } | null}
 */
export function readDailyFocusCache(userId) {
  if (typeof window === "undefined" || !userId) return null;
  try {
    const raw = localStorage.getItem(keyFor(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const { updatedAt, state } = parsed;
    if (typeof updatedAt !== "number" || !state || typeof state !== "object") {
      return null;
    }
    return { state, updatedAt };
  } catch {
    return null;
  }
}

/**
 * @param {string} userId
 * @param {unknown} state
 */
export function writeDailyFocusCache(userId, state) {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.setItem(
      keyFor(userId),
      JSON.stringify({ updatedAt: Date.now(), state })
    );
  } catch {
    /* quota / private mode */
  }
}

/**
 * @param {string} userId
 */
export function clearDailyFocusCache(userId) {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.removeItem(keyFor(userId));
  } catch {
    /* ignore */
  }
}

/**
 * Removes pre–Supabase-only blob (`daily-focus-state-v1`). Safe after auth; does not touch Supabase session keys.
 */
export function clearLegacyAppStorageBlob() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LEGACY_BLOB_KEY);
  } catch {
    /* ignore */
  }
}
