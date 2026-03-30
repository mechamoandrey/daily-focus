import { addDaysYMD } from "@/lib/dateUtils";
import { normalizeHistoryEntryForRead } from "@/lib/historyDetail";
import { countStats } from "@/lib/progress";
export function computeWeeklyExecutionRate(state, anchorYmd) {
  if (!state || typeof anchorYmd !== "string" || anchorYmd.length < 10) return null;
  const history = Array.isArray(state.history) ? state.history : [];
  const historyByDate = new Map();
  for (const h of history) {
    if (!h || typeof h !== "object") continue;
    const d = typeof h.date === "string" ? h.date.slice(0, 10) : "";
    if (d) historyByDate.set(d, h);
  }
  let done = 0;
  let total = 0;
  for (let i = 0; i < 7; i++) {
    const d = addDaysYMD(anchorYmd, -i);
    if (d === anchorYmd) {
      const {
        subDone,
        subTotal
      } = countStats(state.goals, anchorYmd, state.linkedinFriday);
      if (subTotal > 0) {
        done += subDone;
        total += subTotal;
      }
    } else {
      const raw = historyByDate.get(d);
      if (!raw) continue;
      const norm = normalizeHistoryEntryForRead(raw);
      const detail = norm?.detail;
      const vt = detail?.subtasksValidTotal;
      if (typeof vt === "number" && vt > 0) {
        done += typeof detail.subtasksDoneTotal === "number" ? detail.subtasksDoneTotal : 0;
        total += vt;
      }
    }
  }
  if (total === 0) return null;
  return Math.round(done / total * 100);
}
