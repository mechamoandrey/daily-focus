"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

const SEGMENTS = 7;

export function StreakCard({ displayStreak }) {
  const active = displayStreak > 0;
  const filled = Math.min(displayStreak, SEGMENTS);

  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
    >
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
        <Flame
          className={`h-4 w-4 ${active ? "text-orange-400" : "text-zinc-600"}`}
          strokeWidth={1.5}
        />
        Consistência
      </div>
      <p className="mt-4 text-4xl font-semibold tabular-nums tracking-tight text-zinc-50">
        {displayStreak}
        <span className="ml-1 text-lg font-medium text-zinc-500">
          {displayStreak === 1 ? "dia" : "dias"}
        </span>
      </p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">
        Dias seguidos com o plano completo (100%). Cada dia importa para o próximo.
      </p>
      <div className="mt-5 flex gap-1">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scaleY: 0.4, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 24 }}
            className={`h-8 flex-1 rounded-md ${
              i < filled
                ? "bg-gradient-to-t from-orange-500/30 to-amber-400/20 ring-1 ring-orange-400/30"
                : "bg-zinc-800/80"
            }`}
          />
        ))}
      </div>
    </motion.aside>
  );
}
