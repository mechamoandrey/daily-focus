"use client";

import { AppShell } from "@/components/AppShell";
import { BoxesManager } from "@/components/boxes/BoxesManager";
import { useDailyFocusState } from "@/hooks/useDailyFocusState";

export function GoalsClient() {
  const stateApi = useDailyFocusState();

  return (
    <AppShell>
      <main className="flex-1 px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
        <BoxesManager stateApi={stateApi} />
      </main>
    </AppShell>
  );
}
