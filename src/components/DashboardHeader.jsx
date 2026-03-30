"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkle } from "@phosphor-icons/react";
import { MOTION_INTENSITY } from "@/constants/taste";
import { cn } from "@/lib/cn";
import { useLocale } from "@/providers/locale-provider";

export function DashboardHeader({
  dayComplete,
  className,
  dateLabel,
  visibleGoalsCount,
  overallPercent,
}) {
  const { t } = useLocale();

  const subtitleParts = [
    visibleGoalsCount === 1
      ? t("dashboard.metaVisibleOne")
      : t("dashboard.metaVisibleMany", { n: visibleGoalsCount }),
    t("dashboard.percentDone", { n: overallPercent }),
  ];

  return (
    <header className={cn("space-y-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.05 * (MOTION_INTENSITY / 10),
            }}
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500"
          >
            {t("dashboard.execution")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.08 * (MOTION_INTENSITY / 10),
            }}
            className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl"
          >
            {t("dashboard.summaryTitle")}
          </motion.h1>
          <p className="text-sm capitalize text-zinc-300">{dateLabel}</p>
          <p className="text-sm text-zinc-400">
            {subtitleParts.join(" · ")}
          </p>
          <p className="text-xs text-zinc-500">
            <Link
              href="/history"
              className="cursor-pointer text-violet-400/95 underline decoration-violet-500/30 underline-offset-2 transition-colors duration-200 hover:text-violet-300"
            >
              {t("dashboard.linkHistory")}
            </Link>
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3",
            dayComplete
              ? "border-emerald-500/25 bg-emerald-500/[0.07] text-emerald-100/95"
              : "border-white/[0.08] bg-white/[0.03] text-zinc-300"
          )}
        >
          <Sparkle
            className={cn(
              "mt-0.5 h-5 w-5 shrink-0",
              dayComplete ? "text-emerald-400" : "text-violet-400"
            )}
            weight="fill"
          />
          <p className="text-sm leading-relaxed">
            {dayComplete ? t("dashboard.dayDoneLine") : t("dashboard.dayTodoLine")}
          </p>
        </motion.div>
      </div>
    </header>
  );
}
