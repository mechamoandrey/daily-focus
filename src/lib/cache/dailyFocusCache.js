import { STORAGE_KEY as LEGACY_BLOB_KEY } from "@/lib/storageKeys";
const PREFIX = "daily-focus:v1:state:";
function keyFor(userId) {
  return `${PREFIX}${userId}`;
}
export function readDailyFocusCache(userId) {
  if (typeof window === "undefined" || !userId) return null;
  try {
    const raw = localStorage.getItem(keyFor(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const {
      updatedAt,
      state
    } = parsed;
    if (typeof updatedAt !== "number" || !state || typeof state !== "object") {
      return null;
    }
    return {
      state,
      updatedAt
    };
  } catch {
    return null;
  }
}
export function writeDailyFocusCache(userId, state) {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify({
      updatedAt: Date.now(),
      state
    }));
  } catch {}
}
export function clearDailyFocusCache(userId) {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.removeItem(keyFor(userId));
  } catch {}
}
export function clearLegacyAppStorageBlob() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LEGACY_BLOB_KEY);
  } catch {}
}
