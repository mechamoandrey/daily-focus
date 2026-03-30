/** @param {Date} d */
export function formatYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayYMD() {
  return formatYMD(new Date());
}

/** @param {string} ymd */
export function parseYMD(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** @param {string} ymd @param {number} deltaDays */
export function addDaysYMD(ymd, deltaDays) {
  const dt = parseYMD(ymd);
  dt.setDate(dt.getDate() + deltaDays);
  return formatYMD(dt);
}

/** @param {string} a @param {string} b */
export function ymdCompare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/** @param {string} ymd */
export function formatYMDLongPt(ymd) {
  const dt = parseYMD(ymd);
  return dt.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** @param {string} ymd @param {"pt" | "en"} locale */
export function formatYMDLongLocalized(ymd, locale) {
  const dt = parseYMD(ymd);
  const loc = locale === "en" ? "en-US" : "pt-BR";
  return dt.toLocaleDateString(loc, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** Full date string, e.g. "Monday, March 30, 2026". */
export function formatYMDFullPt(ymd) {
  const dt = parseYMD(ymd);
  const s = dt.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** @param {string} ymd @param {"pt" | "en"} locale */
export function formatYMDFullLocalized(ymd, locale) {
  const dt = parseYMD(ymd);
  const loc = locale === "en" ? "en-US" : "pt-BR";
  const s = dt.toLocaleDateString(loc, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Sexta-feira no fuso local (0 = domingo … 5 = sexta). @param {string} ymd */
export function isFridayYMD(ymd) {
  return parseYMD(ymd).getDay() === 5;
}
