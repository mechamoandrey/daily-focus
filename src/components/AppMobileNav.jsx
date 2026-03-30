"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClockCounterClockwise, Package, Target } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { useLocale } from "@/providers/locale-provider";
const NAV = [{
  href: "/",
  msg: "nav.dashboard",
  icon: Target
}, {
  href: "/history",
  msg: "nav.history",
  icon: ClockCounterClockwise
}, {
  href: "/goals",
  msg: "nav.goals",
  icon: Package
}];
export function AppMobileNav() {
  const pathname = usePathname();
  const {
    t
  } = useLocale();
  return <nav aria-label={t("nav.bottomBar")} className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-zinc-950/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <ul className="flex items-stretch justify-around gap-1 px-1 py-2">
        {NAV.map(({
        href,
        msg,
        icon: Icon
      }) => {
          const active = href === "/" ? pathname === "/" || pathname === "" : pathname === href || pathname?.startsWith(`${href}/`);
          return <li key={href} className="min-w-0 flex-1">
              <Link href={href} className={cn("flex cursor-pointer flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-center text-[10px] font-medium leading-tight transition-colors", active ? "text-violet-200" : "text-zinc-500 hover:text-zinc-300")}>
                <Icon className="h-5 w-5 shrink-0" weight={active ? "fill" : "regular"} />
                <span className="line-clamp-2">{t(msg)}</span>
              </Link>
            </li>;
        })}
      </ul>
    </nav>;
}
