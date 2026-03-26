"use client";

import { Target } from "lucide-react";
import { formatDisplayDate } from "@/lib/date";

export function AppSidebar({ dateKey }) {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-zinc-800/60 bg-zinc-950/50 px-5 py-8 lg:flex">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/25">
          <Target className="h-4 w-4 text-emerald-400" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-zinc-100">Daily Focus</p>
          <p className="text-xs text-zinc-500">Execução rumo ao emprego</p>
        </div>
      </div>
      <div className="mt-10 rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-3 py-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          Hoje
        </p>
        <p className="mt-1 text-sm font-medium text-zinc-200">{formatDisplayDate(dateKey)}</p>
      </div>
      <p className="mt-auto text-xs leading-relaxed text-zinc-600">
        Estado salvo neste navegador. Abra todo dia para registrar o fechamento do dia anterior.
      </p>
    </aside>
  );
}
