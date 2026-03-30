import * as localStorageAdapter from "@/lib/storage/localStorageAdapter";
export const localDataSource = {
  name: "local",
  load() {
    return localStorageAdapter.readRaw();
  },
  save(json) {
    localStorageAdapter.writeRaw(json);
  }
};
