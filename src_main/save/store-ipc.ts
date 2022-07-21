import { ipcMainManager } from "../ipc/ipc";
import { store } from "./save";

export const setupStoreIPC = () => {
  ipcMainManager.handle("GET_STORE", async (e, storeKey, defaultValue) => {
    const storeData = await store.get(storeKey, defaultValue);
    return storeData;
  });
  ipcMainManager.handle("SET_STORE", async (e, storeKey, value) => {
    return store.set(storeKey, value);
  });
};
