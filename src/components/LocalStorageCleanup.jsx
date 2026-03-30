"use client";

import { useEffect } from "react";
import { clearLegacyAppStorageBlob } from "@/lib/cache/dailyFocusCache";
export function LocalStorageCleanup() {
  useEffect(() => {
    clearLegacyAppStorageBlob();
  }, []);
  return null;
}
