export async function insertSubtasks(supabase, rows) {
  if (!rows.length) return;
  const {
    error
  } = await supabase.from("subtasks").insert(rows);
  if (error) throw error;
}
