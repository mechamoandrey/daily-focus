"use client";

import { motion } from "framer-motion";
import { Fire } from "@phosphor-icons/react";

const SEGMENTS = 7;

export function StreakCard({ displayStreak }) {
  const active = displayStreak > 0;
  const filled = Math.min(displayStreak, SEGMENTS);

  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[1.25rem] border border-[var(--border)] bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-base)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:rounded-[1.5rem]"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
        <Fire
          className={active ? "text-[var(--accent-bright)]" : "text-[var(--muted)]"}
          size={18}
          weight="duotone"
        />
        <span className="italic">Consistência</span>
      </div>
      <p className="font-display mt-4 text-4xl font-semibold tabular-nums tracking-tight text-[var(--foreground)]">
        {displayStreak}
        <span className="ml-1 text-lg font-medium text-[var(--muted)]">
          {displayStreak === 1 ? "dia" : "dias"}
        </span>
      </p>
      <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-[var(--muted)]">
        Dias seguidos com o plano em 100%. O histórico confirma quando o dia vira.
      </p>
      <div className="mt-6 flex gap-1">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scaleY: 0.45, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 24 }}
            className={`h-8 flex-1 rounded-md ${
              i < filled
                ? "bg-gradient-to-t from-[var(--accent)]/35 to-[var(--accent-bright)]/25 ring-1 ring-[var(--accent)]/25"
                : "bg-[var(--bg-elevated)]"
            }`}
          />
        ))}
      </div>
    </motion.aside>
  );
}
