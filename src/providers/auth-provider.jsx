"use client";

import { createContext, startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentSession, onAuthStateChange, signInWithGoogle as signInWithGoogleApi, signOut as signOutApi } from "@/lib/supabase/auth";
import { clearDailyFocusCache } from "@/lib/cache/dailyFocusCache";
import { getSupabaseClient } from "@/lib/supabase/client";
import { messages } from "@/lib/i18n/messages";
import { resolveInitialLocale } from "@/lib/i18n/resolveLocale";
export const AuthContext = createContext(undefined);
export function AuthProvider({
  children
}) {
  const [supabase, setSupabase] = useState(null);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState(null);
  useEffect(() => {
    let mounted = true;
    let client;
    try {
      client = getSupabaseClient();
    } catch (e) {
      startTransition(() => {
        const loc = resolveInitialLocale();
        const table = messages[loc] ?? messages.pt;
        setInitError(e?.message ?? table["auth.initConfigMissing"] ?? "");
        setIsLoading(false);
      });
      return;
    }
    setSupabase(client);
    getCurrentSession(client).then(({
      data: {
        session: s
      }
    }) => {
      if (!mounted) return;
      setSession(s ?? null);
      setUser(s?.user ?? null);
      setIsLoading(false);
    });
    const {
      data: {
        subscription
      }
    } = onAuthStateChange(client, (_event, s) => {
      setSession(s ?? null);
      setUser(s?.user ?? null);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      const loc = resolveInitialLocale();
      const table = messages[loc] ?? messages.pt;
      return {
        error: new Error(table["auth.supabaseUnavailable"] ?? "Supabase unavailable")
      };
    }
    return signInWithGoogleApi(supabase);
  }, [supabase]);
  const signOut = useCallback(async () => {
    if (!supabase) {
      const loc = resolveInitialLocale();
      const table = messages[loc] ?? messages.pt;
      return {
        error: new Error(table["auth.supabaseUnavailable"] ?? "Supabase unavailable")
      };
    }
    const uid = user?.id;
    const result = await signOutApi(supabase);
    if (uid) clearDailyFocusCache(uid);
    return result;
  }, [supabase, user?.id]);
  const value = useMemo(() => ({
    supabase,
    user,
    session,
    isLoading,
    authLoading: isLoading,
    authError: initError,
    signInWithGoogle,
    signOut
  }), [supabase, user, session, isLoading, initError, signInWithGoogle, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
