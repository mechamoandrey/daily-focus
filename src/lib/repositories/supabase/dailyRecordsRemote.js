export async function deleteDailyRecordsForUser(supabase, userId) {
  const {
    error
  } = await supabase.from("daily_records").delete().eq("user_id", userId);
  if (error) throw error;
}
export async function insertDailyRecords(supabase, rows) {
  if (!rows.length) return;
  const {
    error
  } = await supabase.from("daily_records").insert(rows);
  if (error) throw error;
}
export async function fetchDailyRecordsOrdered(supabase, userId) {
  const {
    data,
    error
  } = await supabase.from("daily_records").select("*").eq("user_id", userId).order("date", {
    ascending: false
  });
  if (error) throw error;
  return data ?? [];
}
