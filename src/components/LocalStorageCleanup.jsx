"use client";

import { useEffect } from "react";
import { clearLegacyAppStorageBlob } from "@/lib/cache/dailyFocusCache";

/** One-time removal of legacy `daily-focus-state-v1` blob; does not touch Supabase Auth keys. */
export function LocalStorageCleanup() {
  useEffect(() => {
    clearLegacyAppStorageBlob();
  }, []);
  return null;
}
