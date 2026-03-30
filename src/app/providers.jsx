"use client";

import { AuthProvider } from "@/providers/auth-provider";
import { LocaleProvider } from "@/providers/locale-provider";
import { AppWithAuth } from "@/components/AppWithAuth";

export function Providers({ children }) {
  return (
    <AuthProvider>
      <LocaleProvider>
        <AppWithAuth>{children}</AppWithAuth>
      </LocaleProvider>
    </AuthProvider>
  );
}
