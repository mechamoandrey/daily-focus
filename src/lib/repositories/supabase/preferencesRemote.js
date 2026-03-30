/**
 * Preferências remotas por utilizador.
 */

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} userId
 */
export async function fetchUserPreferences(supabase, userId) {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {Record<string, unknown>} row
 */
export async function upsertUserPreferences(supabase, row) {
  const { error } = await supabase.from("user_preferences").upsert(row, {
    onConflict: "user_id",
  });
  if (error) throw error;
}
