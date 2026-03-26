"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const MOTIVATIONAL = [
  "Um dia de cada vez. Execução vence intenção.",
  "Clareza hoje, oferta amanhã.",
  "Consistência é o portfólio invisível.",
  "Cada subtarefa é um voto no seu futuro.",
];

function pickPhrase(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return MOTIVATIONAL[Math.abs(h) % MOTIVATIONAL.length];
}

export function DashboardHeader({ dateLabel, dateKey }) {
  const phrase = pickPhrase(dateKey);

  return (
    <header className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm md:p-8">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500"
          >
            Plano do dia
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl"
          >
            {dateLabel}
          </motion.h1>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex max-w-md items-start gap-3 rounded-xl border border-zinc-800/60 bg-zinc-950/50 px-4 py-3"
        >
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/90" strokeWidth={1.5} />
          <p className="text-sm leading-relaxed text-zinc-400">{phrase}</p>
        </motion.div>
      </div>
    </header>
  );
}
