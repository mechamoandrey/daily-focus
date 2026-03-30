"use client";

import { AuthUrlCleanup } from "@/components/AuthUrlCleanup";
import { AuthProvider } from "@/providers/auth-provider";
import { LocaleProvider } from "@/providers/locale-provider";
import { AppWithAuth } from "@/components/AppWithAuth";

export function Providers({ children }) {
  return (
    <AuthProvider>
      <AuthUrlCleanup />
      <LocaleProvider>
        <AppWithAuth>{children}</AppWithAuth>
      </LocaleProvider>
    </AuthProvider>
  );
}
