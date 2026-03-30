/**
 * Metas remotas (Supabase) — usado apenas pela camada `remoteAppState`.
 */

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} userId
 */
export async function deleteGoalsForUser(supabase, userId) {
  const { error } = await supabase.from("goals").delete().eq("user_id", userId);
  if (error) throw error;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} userId
 */
export async function fetchGoalsWithSubtasks(supabase, userId) {
  const { data: goals, error: gErr } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId);
  if (gErr) throw gErr;
  const { data: subtasks, error: sErr } = await supabase
    .from("subtasks")
    .select("*")
    .eq("user_id", userId);
  if (sErr) throw sErr;
  /** @type {Map<string, object[]>} */
  const byGoal = new Map();
  for (const s of subtasks ?? []) {
    const k = `${s.goal_id}`;
    if (!byGoal.has(k)) byGoal.set(k, []);
    byGoal.get(k).push(s);
  }
  for (const arr of byGoal.values()) {
    arr.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }
  return { goals: goals ?? [], subtasksByGoal: byGoal };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {object[]} rows
 */
export async function insertGoals(supabase, rows) {
  if (!rows.length) return;
  const { error } = await supabase.from("goals").insert(rows);
  if (error) throw error;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} userId
 */
export async function listGoalIdMapRows(supabase, userId) {
  const { data, error } = await supabase
    .from("goals")
    .select("id, system_key, is_linkedin")
    .eq("user_id", userId);
  if (error) throw error;
  return data ?? [];
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} userId
 */
export async function countGoalsForUser(supabase, userId) {
  const { count, error } = await supabase
    .from("goals")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) throw error;
  return count ?? 0;
}
