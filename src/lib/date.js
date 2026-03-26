/**
 * Datas no fuso local (YYYY-MM-DD) para reset diário e histórico.
 */

export function getLocalDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Diferença em dias de calendário entre duas chaves YYYY-MM-DD (a <= b). */
export function calendarDaysBetween(aKey, bKey) {
  const a = parseDateKey(aKey);
  const b = parseDateKey(bKey);
  const ms = 86400000;
  return Math.round((b - a) / ms);
}

export function formatDisplayDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
