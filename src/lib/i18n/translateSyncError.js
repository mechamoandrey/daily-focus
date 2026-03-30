/**
 * @param {string | null | undefined} raw
 * @param {(k: string) => string} t
 */
export function translateSyncError(raw, t) {
  if (!raw) return "";
  return raw.startsWith("error.") ? t(raw) : raw;
}
