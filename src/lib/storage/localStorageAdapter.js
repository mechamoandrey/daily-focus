import { STORAGE_KEY } from "@/lib/storageKeys";
export function readRaw() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
export function writeRaw(json) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, json);
  } catch {}
}
