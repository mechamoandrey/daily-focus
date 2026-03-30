function requireNonEmptyString(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing or empty environment variable: ${name}`);
  }
  return value.trim();
}
export function getNextPublicSupabaseUrl() {
  return requireNonEmptyString(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
}
export function getNextPublicSupabaseAnonKey() {
  return requireNonEmptyString(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY");
}
export function getPublicSupabaseConfigOrNull() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return {
    url,
    key
  };
}
