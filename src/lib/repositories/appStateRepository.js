/**
 * Fachada de persistência: a UI e hooks devem preferir estes nomes.
 * Implementação actual: `localDataSource` dentro de `@/lib/storage`.
 */

export {
  createDefaultState,
  loadPersistedState,
  persistState,
  loadState,
  saveState,
} from "@/lib/storage";
