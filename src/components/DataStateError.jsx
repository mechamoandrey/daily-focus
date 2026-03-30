"use client";

import { AppShell } from "@/components/AppShell";
import { useLocale } from "@/providers/locale-provider";
import { translateSyncError } from "@/lib/i18n/translateSyncError";
export function DataStateError({
  message
}) {
  const {
    t
  } = useLocale();
  return <AppShell>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md rounded-2xl border border-rose-500/25 bg-rose-500/[0.06] px-6 py-5 text-center">
          <p className="text-sm text-rose-100/95">
            {translateSyncError(message, t)}
          </p>
          <button type="button" onClick={() => window.location.reload()} className="mt-4 cursor-pointer rounded-xl border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.1]">
            {t("error.reload")}
          </button>
        </div>
      </main>
    </AppShell>;
}
