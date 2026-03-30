export const LOCALES = ["pt", "en"];
const STORAGE_KEY = "daily-focus:locale";
/** Client-only: reads storage/navigator. Do not use as useState initializer — SSR is always "pt". */
export function resolveInitialLocale() {
  if (typeof window === "undefined") return "pt";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "pt") return saved;
  } catch {}
  const n = (navigator.language || "en").toLowerCase();
  return n.startsWith("pt") ? "pt" : "en";
}
export function normalizeLocale(v) {
  return v === "en" || v === "pt" ? v : "pt";
}
export { STORAGE_KEY as LOCALE_STORAGE_KEY };
