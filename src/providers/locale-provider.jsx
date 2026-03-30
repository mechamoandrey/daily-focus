"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/hooks/use-auth";
import { messages } from "@/lib/i18n/messages";
import {
  LOCALE_STORAGE_KEY,
  normalizeLocale,
  resolveInitialLocale,
} from "@/lib/i18n/resolveLocale";
import { fetchUserPreferences, upsertUserPreferences } from "@/lib/repositories/supabase/preferencesRemote";

/** @typedef {{ locale: import("@/lib/i18n/resolveLocale").AppLocale, setLocale: (l: import("@/lib/i18n/resolveLocale").AppLocale) => Promise<void>, t: (key: string, vars?: Record<string, string | number>) => string }} LocaleContextValue */

export const LocaleContext = createContext(
  /** @type {LocaleContextValue | null} */ (null)
);

export function LocaleProvider({ children }) {
  const { user, supabase } = useAuth();
  const [locale, setLocaleState] = useState(() => resolveInitialLocale());

  useEffect(() => {
    if (!user || !supabase) return;
    let cancelled = false;
    (async () => {
      try {
        const prefs = await fetchUserPreferences(supabase, user.id);
        if (cancelled) return;
        const lang = normalizeLocale(prefs?.language);
        if (prefs?.language === "en" || prefs?.language === "pt") {
          setLocaleState(lang);
          try {
            localStorage.setItem(LOCALE_STORAGE_KEY, lang);
          } catch {
            /* ignore */
          }
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, supabase]);

  const t = useCallback(
    (key, vars) => {
      const table = messages[locale] || messages.pt;
      let s = table[key] ?? messages.pt[key] ?? key;
      if (vars && typeof vars === "object") {
        for (const [k, v] of Object.entries(vars)) {
          s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return s;
    },
    [locale]
  );

  const setLocale = useCallback(
    async (next) => {
      const n = normalizeLocale(next);
      setLocaleState(n);
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, n);
      } catch {
        /* ignore */
      }
      if (!user || !supabase) return;
      try {
        const prefs = await fetchUserPreferences(supabase, user.id);
        await upsertUserPreferences(supabase, {
          user_id: user.id,
          last_reset_date: prefs?.last_reset_date ?? null,
          streak: typeof prefs?.streak === "number" ? prefs.streak : 0,
          migration_completed:
            prefs?.migration_completed !== undefined
              ? prefs.migration_completed
              : true,
          language: n,
          updated_at: new Date().toISOString(),
        });
      } catch {
        /* ignore — local preference already applied */
      }
    },
    [user, supabase]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used inside LocaleProvider.");
  }
  return ctx;
}
