import { parseYMD } from "@/lib/dateUtils";

/** ISO order: Monday → Sunday (index 0 = Monday). */
export const WEEKDAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const ALL_WEEKDAY_KEYS = [...WEEKDAY_KEYS];

const VALID = new Set(WEEKDAY_KEYS);

/** @param {string} ymd */
export function weekdayKeyFromYmd(ymd) {
  const d = parseYMD(ymd);
  const d0 = d.getDay(); // 0 Sun … 6 Sat
  const mondayIndex = d0 === 0 ? 6 : d0 - 1;
  return WEEKDAY_KEYS[mondayIndex];
}

/**
 * Metas normais: sem campo ou sem dias → todos os dias (compatível com dados antigos).
 * @param {unknown} raw
 */
export function normalizeGoalVisibleDays(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return [...ALL_WEEKDAY_KEYS];
  const uniq = [];
  const seen = new Set();
  for (const x of raw) {
    if (typeof x !== "string") continue;
    const k = x.toLowerCase().trim();
    if (!VALID.has(k) || seen.has(k)) continue;
    seen.add(k);
    uniq.push(k);
  }
  if (uniq.length === 0) return [...ALL_WEEKDAY_KEYS];
  return WEEKDAY_KEYS.filter((k) => seen.has(k));
}

/**
 * LinkedIn: sem campo → sexta (comportamento anterior).
 * @param {unknown} raw
 */
export function normalizeLinkedinVisibleDays(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return ["friday"];
  const uniq = [];
  const seen = new Set();
  for (const x of raw) {
    if (typeof x !== "string") continue;
    const k = x.toLowerCase().trim();
    if (!VALID.has(k) || seen.has(k)) continue;
    seen.add(k);
    uniq.push(k);
  }
  if (uniq.length === 0) return ["friday"];
  return WEEKDAY_KEYS.filter((k) => seen.has(k));
}

/**
 * @param {string[]} visibleDays
 * @param {string} dateYmd
 */
export function isYmdMatchingVisibleDays(visibleDays, dateYmd) {
  const key = weekdayKeyFromYmd(dateYmd);
  const days = normalizeGoalVisibleDays(visibleDays);
  return days.includes(key);
}
