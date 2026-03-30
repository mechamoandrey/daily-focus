"use client";

import { AppSidebar } from "@/components/AppSidebar";
export function AppShell({
  children
}) {
  return <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-600/10 blur-[90px]" />
      </div>

      <div className="relative mx-auto flex max-w-[1400px]">
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">{children}</div>
      </div>
    </div>;
}
