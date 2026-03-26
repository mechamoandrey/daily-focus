"use client";

import { motion } from "framer-motion";
import { Sparkle } from "@phosphor-icons/react";

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
    <section
      className="relative overflow-hidden rounded-[1.35rem] border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-md)] md:rounded-[1.75rem]"
      aria-label="Resumo do dia"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            "url(https://picsum.photos/seed/dailyfocus/1200/700)",
          backgroundSize: "cover",
          backgroundPosition: "50% 40%",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--bg-base)] via-[var(--bg-base)]/88 to-[var(--bg-base)]/65" />
      <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-[var(--accent-muted)] blur-3xl" />

      <div className="relative p-6 pb-8 md:p-9 md:pb-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-xl space-y-3 text-left">
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm font-medium italic text-[var(--muted)]"
            >
              Plano do dia
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-balance text-4xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-5xl md:leading-[1.08]"
            >
              {dateLabel}
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-w-md items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-base)]/55 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
          >
            <Sparkle
              className="mt-0.5 shrink-0 text-[var(--accent-bright)]"
              size={18}
              weight="duotone"
            />
            <p className="max-w-[65ch] text-sm leading-relaxed text-[var(--muted)]">{phrase}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
