/** @typedef {"pt" | "en"} AppLocale */

export const LOCALES = /** @type {const} */ (["pt", "en"]);

const STORAGE_KEY = "daily-focus:locale";

/**
 * Idioma inicial antes de auth / prefs (navegador + cache local).
 * @returns {AppLocale}
 */
export function resolveInitialLocale() {
  if (typeof window === "undefined") return "pt";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "pt") return saved;
  } catch {
    /* ignore */
  }
  const n = (navigator.language || "en").toLowerCase();
  return n.startsWith("pt") ? "pt" : "en";
}

/**
 * @param {unknown} v
 * @returns {AppLocale}
 */
export function normalizeLocale(v) {
  return v === "en" || v === "pt" ? v : "pt";
}

export { STORAGE_KEY as LOCALE_STORAGE_KEY };
