"use client";

import { motion } from "framer-motion";
import { formatDisplayDate } from "@/lib/date";
import { cn } from "@/lib/cn";

export function HistoryPanel({ entries }) {
  const list = entries.slice(0, 14);

  return (
    <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/25 p-5 md:p-6">
      <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
        Histórico recente
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        Últimos dias registrados ao trocar o dia civil.
      </p>

      {list.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-8 text-center text-sm text-zinc-500">
          O histórico aparece após o primeiro dia com o app salvo e ao virar o dia.
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {list.map((row, i) => (
            <motion.li
              key={row.date}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.25 }}
              className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800/60 bg-zinc-950/40 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  {formatDisplayDate(row.date)}
                </p>
                <p className="text-xs text-zinc-500">{row.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm tabular-nums text-zinc-300">{row.percent}%</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    row.complete
                      ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25"
                      : "bg-zinc-800 text-zinc-400"
                  )}
                >
                  {row.complete ? "100%" : "Parcial"}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
