/**
 * Centralized reads for public env vars (NEXT_PUBLIC_*).
 * Never put secrets here.
 *
 * Always use literal `process.env.NEXT_PUBLIC_*` names — Next.js only inlines
 * these into the client bundle when access is static (not dynamic keys).
 */

/**
 * @param {string | undefined} value
 * @param {string} name Literal variable name (for error messages)
 */
function requireNonEmptyString(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing or empty environment variable: ${name}`);
  }
  return value.trim();
}

export function getNextPublicSupabaseUrl() {
  return requireNonEmptyString(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    "NEXT_PUBLIC_SUPABASE_URL"
  );
}

export function getNextPublicSupabaseAnonKey() {
  return requireNonEmptyString(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

/**
 * For middleware / optional paths: returns null if either var is unset (no throw).
 * Uses the same literal env keys as the getters above.
 *
 * @returns {{ url: string, key: string } | null}
 */
export function getPublicSupabaseConfigOrNull() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return { url, key };
}
