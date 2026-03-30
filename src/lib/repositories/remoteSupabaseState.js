/**
 * Re-export da implementação em `supabase/remoteAppState.js` (compatibilidade de imports).
 */
export {
  assembleStateFromRemote,
  fetchGoalsWithSubtasks,
  loadRemoteUserState,
  persistFullStateRemote,
  seedDefaultUserData,
  tryMigrateLocalToRemote,
} from "@/lib/repositories/supabase/remoteAppState";
