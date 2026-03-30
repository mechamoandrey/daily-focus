import { createClient } from "@supabase/supabase-js";
import {
  getNextPublicSupabaseAnonKey,
  getNextPublicSupabaseUrl,
} from "@/lib/env/public";

/** @type {import("@supabase/supabase-js").SupabaseClient | null} */
let browserSingleton = null;

/**
 * Cliente Supabase para o browser (instância única).
 * Só deve ser chamado em código que corre no cliente.
 */
export function getSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error(
      "getSupabaseClient() só está disponível no browser (use em Client Components / useEffect)."
    );
  }
  if (!browserSingleton) {
    const url = getNextPublicSupabaseUrl();
    const key = getNextPublicSupabaseAnonKey();
    browserSingleton = createClient(url, key);
  }
  return browserSingleton;
}
