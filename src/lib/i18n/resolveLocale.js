export const LOCALES = ["pt", "en"];
const STORAGE_KEY = "daily-focus:locale";
/** Client-only: reads storage/navigator. SSR initial locale must match useState (see LocaleProvider). */
export function resolveInitialLocale() {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "pt") return saved;
  } catch {}
  const n = (navigator.language || "en").toLowerCase();
  return n.startsWith("pt") ? "pt" : "en";
}
export function normalizeLocale(v) {
  return v === "en" || v === "pt" ? v : "en";
}
export { STORAGE_KEY as LOCALE_STORAGE_KEY };
