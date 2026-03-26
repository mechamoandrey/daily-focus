"use client";

import { motion } from "framer-motion";
import { formatDisplayDate } from "@/lib/date";
import { cn } from "@/lib/cn";

export function HistoryPanel({ entries }) {
  const list = entries.slice(0, 14);

  return (
    <section
      aria-labelledby="history-heading"
      className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--bg-card)]/80 p-5 md:rounded-[1.5rem] md:p-7"
    >
      <h2
        id="history-heading"
        className="text-sm font-medium italic text-[var(--muted)]"
      >
        Histórico recente
      </h2>
      <p className="mt-1 max-w-[65ch] text-pretty text-sm leading-relaxed text-[var(--muted)]">
        Últimos dias gravados quando a data muda no relógio local.
      </p>

      {list.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-base)]/50 px-5 py-10 text-center">
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            Ainda não há dias fechados. Volte amanhã: ao virar o dia, o app registra o dia
            anterior e limpa as subtarefas.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-2">
          {list.map((row, i) => (
            <motion.li
              key={row.date}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.25 }}
              className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-base)]/55 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {formatDisplayDate(row.date)}
                </p>
                <p className="text-xs tabular-nums text-[var(--muted)]">{row.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm tabular-nums text-[var(--foreground)]">
                  {row.percent}%
                </span>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-xs font-medium",
                    row.complete
                      ? "bg-[var(--accent-muted)] text-[var(--accent-bright)] ring-1 ring-[var(--accent)]/25"
                      : "bg-[var(--bg-elevated)] text-[var(--muted)]"
                  )}
                >
                  {row.complete ? "Completo" : "Parcial"}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
