"use client";

import { motion } from "framer-motion";
import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export function SubtaskItem({ title, done, onToggle, index }) {
  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.28,
        delay: index * 0.035,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={onToggle}
      className={cn(
        "group flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-[border-color,background-color,transform] duration-200",
        "hover:border-[var(--border)] hover:bg-[var(--bg-elevated)]/80 active:translate-y-px active:scale-[0.995]",
        done
          ? "border-[var(--accent)]/30 bg-[var(--accent-muted)]"
          : "border-transparent bg-[var(--bg-base)]/40"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[0.35rem] border transition-all duration-200",
          done
            ? "border-[var(--accent-bright)]/55 bg-[var(--accent-muted)] text-[var(--accent-bright)]"
            : "border-[var(--border)] bg-[var(--bg-elevated)] group-hover:border-[var(--muted)]"
        )}
      >
        <motion.span
          initial={false}
          animate={{ scale: done ? 1 : 0.85, opacity: done ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          <Check size={14} weight="bold" />
        </motion.span>
      </span>
      <span
        className={cn(
          "text-sm leading-snug transition-colors duration-200",
          done
            ? "text-[var(--muted)] line-through decoration-[var(--muted)]/60"
            : "text-[var(--foreground)]"
        )}
      >
        {title}
      </span>
    </motion.button>
  );
}
