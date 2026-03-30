import { sanitizeOptionalUuidId } from "@/lib/repositories/supabase/mappers";
export async function insertSubtasks(supabase, rows) {
  if (!rows.length) return;
  const cleaned = rows.map(r => sanitizeOptionalUuidId({
    ...r
  }));
  const {
    error
  } = await supabase.from("subtasks").insert(cleaned);
  if (error) throw error;
}
