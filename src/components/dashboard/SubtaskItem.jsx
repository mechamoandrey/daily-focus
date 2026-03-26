"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export function SubtaskItem({ title, done, onToggle, index }) {
  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.28,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={onToggle}
      className={cn(
        "group flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors duration-200",
        "hover:border-zinc-600/80 hover:bg-zinc-800/40 active:scale-[0.99]",
        done
          ? "border-emerald-500/25 bg-emerald-500/5"
          : "border-transparent bg-zinc-950/30"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200",
          done
            ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-200"
            : "border-zinc-600 bg-zinc-900 group-hover:border-zinc-500"
        )}
      >
        <motion.span
          initial={false}
          animate={{ scale: done ? 1 : 0.85, opacity: done ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
        </motion.span>
      </span>
      <span
        className={cn(
          "text-sm leading-snug transition-colors duration-200",
          done ? "text-zinc-400 line-through decoration-zinc-600" : "text-zinc-200"
        )}
      >
        {title}
      </span>
    </motion.button>
  );
}
