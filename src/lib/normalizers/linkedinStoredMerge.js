import { emptyLinkedinFridayFromTemplate } from "@/data/linkedinFriday";
import { normalizeLinkedinVisibleDays } from "@/lib/visibleDays";

/**
 * Junta dados guardados do bloco LinkedIn ao template atual (compatível com versões antigas).
 * @param {unknown} stored
 */
export function mergeLinkedinStored(stored) {
  const base = emptyLinkedinFridayFromTemplate();
  const visibleDays = normalizeLinkedinVisibleDays(
    stored && typeof stored === "object" ? stored.visibleDays : undefined
  );
  const prev = stored?.subtasks;
  if (!Array.isArray(prev)) {
    return { ...base, visibleDays };
  }
  const byId = new Map(prev.map((s) => [s.id, s]));
  return {
    visibleDays,
    subtasks: base.subtasks.map((t) => {
      const old = byId.get(t.id);
      return { ...t, done: Boolean(old?.done) };
    }),
  };
}
