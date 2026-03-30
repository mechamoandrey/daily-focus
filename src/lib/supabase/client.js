import { createClient } from "@supabase/supabase-js";
import {
  getNextPublicSupabaseAnonKey,
  getNextPublicSupabaseUrl,
} from "@/lib/env/public";

/** @type {import("@supabase/supabase-js").SupabaseClient | null} */
let browserSingleton = null;

/**
 * Browser Supabase client (singleton).
 * Only call from code that runs in the browser.
 */
export function getSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error(
      "getSupabaseClient() is only available in the browser (Client Components / useEffect)."
    );
  }
  if (!browserSingleton) {
    const url = getNextPublicSupabaseUrl();
    const key = getNextPublicSupabaseAnonKey();
    browserSingleton = createClient(url, key, {
      auth: {
        flowType: "pkce",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return browserSingleton;
}
