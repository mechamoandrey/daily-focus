"use client";

import { motion } from "framer-motion";
import { Check } from "@phosphor-icons/react";
import { MOTION_INTENSITY } from "@/constants/taste";
import { cn } from "@/lib/cn";
export function SubtaskItem({
  goalId,
  subtask,
  onToggle
}) {
  const {
    id,
    label,
    done,
    hint
  } = subtask;
  return <motion.button type="button" layout whileHover={{
    x: 2
  }} whileTap={{
    scale: 0.99
  }} transition={{
    layout: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1]
    },
    type: "spring",
    stiffness: 420,
    damping: 28 + MOTION_INTENSITY
  }} onClick={() => onToggle(goalId, id)} className={cn("group flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors", done ? "border-white/[0.06] bg-white/[0.03] text-zinc-400" : "border-transparent bg-transparent text-zinc-200 hover:border-white/[0.08] hover:bg-white/[0.04]")}>
      <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200", done ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300" : "border-zinc-600 bg-zinc-900/80 group-hover:border-violet-500/40 group-hover:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]")}>
        {done && <motion.span initial={{
        scale: 0.6,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} transition={{
        duration: 0.2
      }}>
            <Check className="h-3.5 w-3.5" weight="bold" />
          </motion.span>}
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-sm leading-snug", done && "line-through decoration-zinc-600")}>
          {label}
        </span>
        {hint ? <span className={cn("mt-1 block text-xs leading-relaxed text-zinc-500", done && "line-through decoration-zinc-700")}>
            {hint}
          </span> : null}
      </span>
    </motion.button>;
}
