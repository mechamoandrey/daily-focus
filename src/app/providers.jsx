"use client";

import { AuthUrlCleanup } from "@/components/AuthUrlCleanup";
import { LocalStorageCleanup } from "@/components/LocalStorageCleanup";
import { AuthProvider } from "@/providers/auth-provider";
import { LocaleProvider } from "@/providers/locale-provider";
import { AppWithAuth } from "@/components/AppWithAuth";

export function Providers({ children }) {
  return (
    <AuthProvider>
      <LocalStorageCleanup />
      <AuthUrlCleanup />
      <LocaleProvider>
        <AppWithAuth>{children}</AppWithAuth>
      </LocaleProvider>
    </AuthProvider>
  );
}
