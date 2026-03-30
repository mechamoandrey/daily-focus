"use client";

import { startTransition, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GoogleLogo } from "@phosphor-icons/react";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/providers/locale-provider";

function AuthScreen() {
  const { t } = useLocale();
  const { supabase, authError, signInWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "error") {
      const path = window.location.pathname || "/";
      window.history.replaceState({}, "", path);
      startTransition(() => setErr("auth.urlError"));
    }
  }, []);

  async function handleGoogle() {
    if (!supabase) return;
    setBusy(true);
    setErr(null);
    const { error } = await signInWithGoogle();
    if (error) setErr(error.message);
    setBusy(false);
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-600/10 blur-[90px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/[0.08] bg-zinc-900/60 p-8 shadow-2xl ring-1 ring-white/[0.06] backdrop-blur-sm"
      >
        <div className="mb-6 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-violet-300/90">
            Daily Focus
          </p>
          <h1 className="mt-2 text-xl font-semibold text-zinc-50">
            {t("auth.syncTitle")}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">{t("auth.syncBody")}</p>
        </div>
        {(authError || err) ? (
          <p className="mb-4 rounded-xl border border-rose-500/25 bg-rose-500/[0.08] px-3 py-2 text-sm text-rose-100/95">
            {authError ||
              (typeof err === "string" && err.startsWith("auth.") ? t(err) : err)}
          </p>
        ) : null}
        <motion.button
          type="button"
          disabled={busy || !supabase}
          onClick={handleGoogle}
          whileHover={{ scale: busy ? 1 : 1.01 }}
          whileTap={{ scale: busy ? 1 : 0.99 }}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.06] px-4 py-3 text-sm font-medium text-zinc-100 transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <GoogleLogo className="h-5 w-5" weight="bold" />
          {busy ? t("auth.googleLoading") : t("auth.google")}
        </motion.button>
        <p className="mt-5 text-center text-[11px] text-zinc-500">
          {t("auth.termsHint")}
        </p>
      </motion.div>
    </div>
  );
}

function AuthLoading() {
  const { t } = useLocale();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="h-10 w-10 animate-pulse rounded-full bg-violet-500/20 ring-2 ring-violet-500/30" />
      <p className="mt-4 text-sm text-zinc-500">{t("auth.loadingSession")}</p>
    </div>
  );
}

export function AppWithAuth({ children }) {
  const { user, authLoading, authError } = useAuth();

  if (authLoading && !authError) {
    return <AuthLoading />;
  }

  if (authError && !user) {
    return <AuthScreen />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return children;
}
