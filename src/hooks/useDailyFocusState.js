"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  startTransition,
} from "react";
import {
  filterGoalsForCalendarDay,
  sortGoalsByOrder,
} from "@/lib/goalModel";
import { todayYMD } from "@/lib/dateUtils";
import { computeOverallPercent } from "@/lib/progress";
import { applyToggleSubtask } from "@/lib/repositories/dailyActions";
import {
  loadRemoteUserState,
  persistFullStateRemote,
} from "@/lib/repositories/remoteSupabaseState";
import {
  readDailyFocusCache,
  writeDailyFocusCache,
} from "@/lib/cache/dailyFocusCache";
import { useAuth } from "@/hooks/use-auth";

export function useDailyFocusState() {
  const { supabase, user, authLoading } = useAuth();
  /** Stable id — `user` object identity changes on Supabase token refresh (e.g. tab focus). */
  const userId = user?.id ?? null;
  const [state, setState] = useState(null);
  const [bootLoading, setBootLoading] = useState(true);
  const [syncError, setSyncError] = useState(null);
  const skipPersist = useRef(true);

  useEffect(() => {
    if (authLoading || !userId || !supabase) {
      if (!authLoading && !userId) {
        setState(null);
        setBootLoading(false);
        setSyncError(null);
      }
      return;
    }

    let cancelled = false;

    async function load() {
      const cached = readDailyFocusCache(userId);
      if (cached?.state && !cancelled) {
        setState(cached.state);
        skipPersist.current = true;
        setBootLoading(false);
      }
      try {
        setSyncError(null);
        const s = await loadRemoteUserState(supabase, userId);
        if (!cancelled) {
          setState(s);
          skipPersist.current = true;
          writeDailyFocusCache(userId, s);
        }
      } catch (e) {
        if (!cancelled) {
          setSyncError(e?.message ?? "error.dataLoad");
          if (!readDailyFocusCache(userId)?.state) {
            setState(null);
          }
        }
      } finally {
        if (!cancelled) setBootLoading(false);
      }
    }

    setBootLoading(true);
    startTransition(() => load());

    return () => {
      cancelled = true;
    };
  }, [authLoading, userId, supabase]);

  useEffect(() => {
    if (!userId || !supabase || !state || bootLoading) return;
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    const t = setTimeout(() => {
      persistFullStateRemote(supabase, userId, state)
        .then(() => {
          setSyncError(null);
          writeDailyFocusCache(userId, state);
        })
        .catch((e) => {
          setSyncError(e?.message ?? "error.save");
        });
    }, 500);
    return () => clearTimeout(t);
  }, [state, userId, supabase, bootLoading]);

  const toggleSubtask = useCallback((goalId, subtaskId) => {
    setState((prev) => applyToggleSubtask(prev, goalId, subtaskId));
  }, []);

  const dayYmd = state ? state.lastResetDate || todayYMD() : todayYMD();
  const dashboardGoals = state
    ? sortGoalsByOrder(filterGoalsForCalendarDay(state.goals, dayYmd))
    : [];
  const overallPercent = state
    ? computeOverallPercent(state.goals, dayYmd, state.linkedinFriday)
    : 0;
  const dayComplete = overallPercent === 100;

  const ready =
    !authLoading && !bootLoading && Boolean(userId) && Boolean(state);

  return {
    ready,
    state,
    setState,
    toggleSubtask,
    overallPercent,
    dayComplete,
    dashboardGoals,
    syncError,
    authLoading,
    bootLoading,
  };
}
