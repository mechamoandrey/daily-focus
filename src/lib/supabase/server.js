import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getNextPublicSupabaseAnonKey, getNextPublicSupabaseUrl } from "@/lib/env/public";
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = getNextPublicSupabaseUrl();
  const key = getNextPublicSupabaseAnonKey();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({
            name,
            value,
            options
          }) => cookieStore.set(name, value, options));
        } catch {}
      }
    }
  });
}
