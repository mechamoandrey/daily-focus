export function formatYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
export function todayYMD() {
  return formatYMD(new Date());
}
export function parseYMD(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function addDaysYMD(ymd, deltaDays) {
  const dt = parseYMD(ymd);
  dt.setDate(dt.getDate() + deltaDays);
  return formatYMD(dt);
}
export function ymdCompare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
export function formatYMDLongPt(ymd) {
  const dt = parseYMD(ymd);
  return dt.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
export function formatYMDLongLocalized(ymd, locale) {
  const dt = parseYMD(ymd);
  const loc = locale === "en" ? "en-US" : "pt-BR";
  return dt.toLocaleDateString(loc, {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
export function formatYMDFullPt(ymd) {
  const dt = parseYMD(ymd);
  const s = dt.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
export function formatYMDFullLocalized(ymd, locale) {
  const dt = parseYMD(ymd);
  const loc = locale === "en" ? "en-US" : "pt-BR";
  const s = dt.toLocaleDateString(loc, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
export function isFridayYMD(ymd) {
  return parseYMD(ymd).getDay() === 5;
}
