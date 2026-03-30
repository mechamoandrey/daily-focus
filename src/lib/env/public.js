/**
 * Leitura centralizada de variáveis públicas (NEXT_PUBLIC_*).
 * Nunca colocar segredos aqui.
 *
 * Importante: usar sempre `process.env.NEXT_PUBLIC_*` com nome literal —
 * o Next.js só injeta essas variáveis no client bundle quando o acesso é estático.
 */

/**
 * @param {string | undefined} value
 * @param {string} name Nome literal da variável (para mensagens de erro)
 */
function requireNonEmptyString(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Variável de ambiente em falta ou vazia: ${name}`);
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
