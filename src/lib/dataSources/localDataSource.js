/**
 * Fonte de dados local — `localStorage` (migração inicial via `remoteAppState`).
 */

import * as localStorageAdapter from "@/lib/storage/localStorageAdapter";

export const localDataSource = {
  name: "local",

  /**
   * @returns {string | null} JSON bruto ou null
   */
  load() {
    return localStorageAdapter.readRaw();
  },

  /**
   * @param {string} json
   */
  save(json) {
    localStorageAdapter.writeRaw(json);
  },
};
