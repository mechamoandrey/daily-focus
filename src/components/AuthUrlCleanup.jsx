"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

const HASH_AUTH_PATTERN =
  /access_token|refresh_token|provider_token|error=|error_description|type=|expires_in|token_type/;

/**
 * After Supabase parses the session from the URL (hash or query), removes
 * tokens from the address bar so they are never visible long-term.
 */
function stripSensitiveQueryParams(search) {
  const sp = new URLSearchParams(search);
  const remove = [
    "access_token",
    "refresh_token",
    "expires_in",
    "expires_at",
    "token_type",
    "provider_token",
    "provider_refresh_token",
    "type",
  ];
  for (const k of remove) sp.delete(k);
  const out = sp.toString();
  return out ? `?${out}` : "";
}

/**
 * Cleans OAuth tokens from hash/query once `getSession()` has persisted them.
 */
export function AuthUrlCleanup() {
  const { supabase } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const { pathname, search, hash, href } = window.location;
    const hashNeedsAuth = hash.length > 1 && HASH_AUTH_PATTERN.test(hash);
    const sp = new URLSearchParams(search);
    const queryNeedsAuth =
      sp.has("access_token") ||
      sp.has("refresh_token") ||
      sp.has("provider_token");

    if (!supabase) {
      if (href.endsWith("#") && !hashNeedsAuth) {
        window.history.replaceState(null, "", `${pathname}${search}` || "/");
      }
      return;
    }

    if (hashNeedsAuth || queryNeedsAuth) {
      void supabase.auth.getSession().finally(() => {
        const nextSearch = queryNeedsAuth
          ? stripSensitiveQueryParams(search)
          : search;
        window.history.replaceState(
          null,
          "",
          `${pathname}${nextSearch}` || "/"
        );
      });
      return;
    }

    if (href.endsWith("#")) {
      window.history.replaceState(null, "", `${pathname}${search}` || "/");
    }
  }, [supabase]);

  return null;
}
