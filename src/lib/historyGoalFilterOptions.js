import { LINKEDIN_FRIDAY_META } from "@/data/linkedinFriday";
export function buildHistoryGoalFilterOptions(state, t) {
  const rows = [{
    id: "all",
    label: t("dashboard.filters.allGoals")
  }];
  if (!state || typeof state !== "object") return rows;
  const seen = new Set(["all"]);
  const goals = Array.isArray(state.goals) ? state.goals : [];
  for (const g of goals) {
    if (!g || typeof g !== "object") continue;
    const id = typeof g.id === "string" ? g.id.trim() : "";
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const title = typeof g.title === "string" && g.title.trim().length > 0 ? g.title.trim() : id;
    rows.push({
      id,
      label: title
    });
  }
  const liId = LINKEDIN_FRIDAY_META.id;
  if (!seen.has(liId)) {
    rows.push({
      id: liId,
      label: t("goals.linkedinTitle")
    });
  }
  return rows;
}
