/**
 * Subtarefas remotas — inserção em batch após metas.
 */

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {object[]} rows
 */
export async function insertSubtasks(supabase, rows) {
  if (!rows.length) return;
  const { error } = await supabase.from("subtasks").insert(rows);
  if (error) throw error;
}
