"use client";

import { Crosshair } from "@phosphor-icons/react";
import { formatDisplayDate } from "@/lib/date";

export function AppTopNav({ dateKey }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-base)]/85 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 py-4 md:px-8"
        aria-label="Principal"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-muted)] ring-1 ring-[var(--border)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <Crosshair className="text-[var(--accent-bright)]" size={20} weight="duotone" />
          </span>
          <div className="min-w-0">
            <p className="font-display truncate text-base font-semibold tracking-tight text-[var(--foreground)]">
              Daily Focus
            </p>
            <p className="truncate text-xs font-medium text-[var(--muted)]">
              Plano diário rumo ao emprego
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-right shadow-[var(--shadow-sm)]">
          <p className="text-[10px] font-medium tracking-[0.14em] text-[var(--muted)]">Hoje</p>
          <p className="text-sm font-medium tabular-nums text-[var(--foreground)]">
            {formatDisplayDate(dateKey)}
          </p>
        </div>
      </nav>
    </header>
  );
}
