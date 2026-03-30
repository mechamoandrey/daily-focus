import { createClient } from "@supabase/supabase-js";
import { getNextPublicSupabaseAnonKey, getNextPublicSupabaseUrl } from "@/lib/env/public";
let browserSingleton = null;
export function getSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseClient() is only available in the browser (Client Components / useEffect).");
  }
  if (!browserSingleton) {
    const url = getNextPublicSupabaseUrl();
    const key = getNextPublicSupabaseAnonKey();
    browserSingleton = createClient(url, key, {
      auth: {
        flowType: "pkce",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  return browserSingleton;
}
