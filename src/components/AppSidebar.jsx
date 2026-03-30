"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ClockCounterClockwise,
  Package,
  SignOut,
  Target,
} from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/providers/locale-provider";

const NAV = [
  { href: "/", msg: "nav.dashboard", icon: Target },
  { href: "/history", msg: "nav.history", icon: ClockCounterClockwise },
  { href: "/goals", msg: "nav.goals", icon: Package },
];

export function AppSidebar({ className }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { t, locale, setLocale } = useLocale();

  async function handleSignOut() {
    await signOut();
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "hidden h-screen w-56 shrink-0 flex-col border-r border-white/[0.06] bg-zinc-950/40 px-5 py-8 lg:sticky lg:top-0 lg:flex",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/25">
          <Target className="h-5 w-5" weight="fill" />
        </span>
        <div>
          <p className="text-sm font-semibold tracking-tight text-zinc-100">
            Daily Focus
          </p>
          <p className="text-[11px] text-zinc-500">{t("brand.subtitle")}</p>
        </div>
      </div>
      <div className="mt-8 space-y-2">
        <label className="block px-2 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
          {t("locale.label")}
        </label>
        <select
          value={locale}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "pt" || v === "en") void setLocale(v);
          }}
          className="w-full cursor-pointer rounded-xl border border-white/[0.08] bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200 outline-none transition hover:border-white/[0.12]"
        >
          <option value="pt">{t("locale.pt")}</option>
          <option value="en">{t("locale.en")}</option>
        </select>
      </div>
      <div className="mt-10 space-y-1 text-sm">
        <p className="px-2 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
          {t("nav.vision")}
        </p>
        <nav className="space-y-1">
          {NAV.map(({ href, msg, icon: Icon }) => {
            const active =
              href === "/"
                ? pathname === "/" || pathname === ""
                : pathname === href || pathname?.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 transition-colors duration-200",
                  active
                    ? "bg-white/[0.06] text-zinc-100 ring-1 ring-white/[0.06]"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                )}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-90" weight="regular" />
                {t(msg)}
              </Link>
            );
          })}
        </nav>
      </div>

      {user ? (
        <div className="mt-auto border-t border-white/[0.06] pt-6">
          <p className="truncate px-2 text-[11px] text-zinc-500" title={user.email ?? ""}>
            {user.email ?? t("auth.account")}
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:text-zinc-200"
          >
            <SignOut className="h-4 w-4 shrink-0" />
            {t("auth.signOut")}
          </button>
        </div>
      ) : null}
    </motion.aside>
  );
}
