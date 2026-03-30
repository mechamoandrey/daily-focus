/**
 * Fachada de persistência: a UI e hooks devem preferir estes nomes.
 * Legacy re-exports. Persisted state lives in Supabase; these no longer read/write the old local blob.
 */

export {
  createDefaultState,
  loadPersistedState,
  persistState,
  loadState,
  saveState,
} from "@/lib/storage";
