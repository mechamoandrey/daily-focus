/**
 * Único ponto de acesso direto a `localStorage` para a chave da app.
 * Trocar por IndexedDB ou sync remoto afeta só este ficheiro + data source.
 */

import { STORAGE_KEY } from "@/lib/storageKeys";

/**
 * @returns {string | null}
 */
export function readRaw() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * @param {string} json
 */
export function writeRaw(json) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, json);
  } catch {
    /* quota / private mode */
  }
}
