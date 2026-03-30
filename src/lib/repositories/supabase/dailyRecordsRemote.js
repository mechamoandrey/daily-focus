/**
 * Histórico diário remoto.
 */

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} userId
 */
export async function deleteDailyRecordsForUser(supabase, userId) {
  const { error } = await supabase
    .from("daily_records")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {object[]} rows
 */
export async function insertDailyRecords(supabase, rows) {
  if (!rows.length) return;
  const { error } = await supabase.from("daily_records").insert(rows);
  if (error) throw error;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} userId
 */
export async function fetchDailyRecordsOrdered(supabase, userId) {
  const { data, error } = await supabase
    .from("daily_records")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
