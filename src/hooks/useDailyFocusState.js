"use client";

import { useCallback, useEffect, useRef, useState, startTransition } from "react";
import { filterGoalsForCalendarDay, sortGoalsByOrder } from "@/lib/goalModel";
import { todayYMD } from "@/lib/dateUtils";
import { computeOverallPercent } from "@/lib/progress";
import { applyToggleSubtask } from "@/lib/repositories/dailyActions";
import { loadRemoteUserState, persistFullStateRemote } from "@/lib/repositories/remoteSupabaseState";
import { readDailyFocusCache, writeDailyFocusCache } from "@/lib/cache/dailyFocusCache";
import { useAuth } from "@/hooks/use-auth";
function cloneAppState(s) {
  if (!s) return null;
  try {
    return structuredClone(s);
  } catch {
    return JSON.parse(JSON.stringify(s));
  }
}
export function useDailyFocusState() {
  const {
    supabase,
    user,
    authLoading
  } = useAuth();
  const userId = user?.id ?? null;
  const [state, setState] = useState(null);
  const [bootLoading, setBootLoading] = useState(true);
  const [syncError, setSyncError] = useState(null);
  const skipPersist = useRef(true);
  const lastPersistedStateRef = useRef(null);
  const ignoreNextPersist = useRef(false);
  useEffect(() => {
    if (authLoading || !userId || !supabase) {
      if (!authLoading && !userId) {
        setState(null);
        setBootLoading(false);
        setSyncError(null);
        lastPersistedStateRef.current = null;
      }
      return;
    }
    let cancelled = false;
    const cached = readDailyFocusCache(userId);
    if (cached?.state) {
      setState(cached.state);
      lastPersistedStateRef.current = cloneAppState(cached.state);
      skipPersist.current = true;
      setBootLoading(false);
    } else {
      setBootLoading(true);
    }
    async function load() {
      try {
        setSyncError(null);
        const s = await loadRemoteUserState(supabase, userId);
        if (!cancelled) {
          setState(s);
          lastPersistedStateRef.current = cloneAppState(s);
          skipPersist.current = true;
          writeDailyFocusCache(userId, s);
        }
      } catch (e) {
        if (!cancelled) {
          setSyncError(e?.message ?? "error.dataLoad");
          if (!readDailyFocusCache(userId)?.state) {
            setState(null);
            lastPersistedStateRef.current = null;
          }
        }
      } finally {
        if (!cancelled) setBootLoading(false);
      }
    }
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
    if (ignoreNextPersist.current) {
      ignoreNextPersist.current = false;
      return;
    }
    const t = setTimeout(() => {
      const snapshot = cloneAppState(state);
      persistFullStateRemote(supabase, userId, state).then(() => {
        setSyncError(null);
        lastPersistedStateRef.current = snapshot;
        writeDailyFocusCache(userId, state);
      }).catch(e => {
        setSyncError(e?.message ?? "error.save");
        const rollback = lastPersistedStateRef.current;
        if (rollback) {
          ignoreNextPersist.current = true;
          setState(cloneAppState(rollback));
        }
      });
    }, 500);
    return () => clearTimeout(t);
  }, [state, userId, supabase, bootLoading]);
  const toggleSubtask = useCallback((goalId, subtaskId) => {
    setState(prev => applyToggleSubtask(prev, goalId, subtaskId));
  }, []);
  const dayYmd = state ? state.lastResetDate || todayYMD() : todayYMD();
  const dashboardGoals = state ? sortGoalsByOrder(filterGoalsForCalendarDay(state.goals, dayYmd)) : [];
  const overallPercent = state ? computeOverallPercent(state.goals, dayYmd, state.linkedinFriday) : 0;
  const dayComplete = overallPercent === 100;
  const ready = !authLoading && !bootLoading && Boolean(userId) && Boolean(state);
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
    bootLoading
  };
}
