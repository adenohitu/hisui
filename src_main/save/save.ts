import Store from "electron-store";
import { submitLanguage } from "../data/scraping/submitlang";
import { languagetype } from "../file/extension";
import { ipcMainManager } from "../ipc/ipc";
type StoreType = {
  // mainwindowの状態
  "window.main.width": number | undefined;
  "window.main.height": number | undefined;
  "window.main.x": number | undefined;
  "window.main.y": number | undefined;
  "window.main.isMax": boolean | undefined;
  // taskViewWindowの状態
  "window.taskView.width": number | undefined;
  "window.taskView.height": number | undefined;
  "window.taskView.x": number | undefined;
  "window.taskView.y": number | undefined;
  // ファイル保存に関する状態
  saveDefaultFolder: string;
  defaultLanguage: languagetype;
  submitLanguage: submitLanguage;
  // mosaicの状態保持
  WindowState: any;
  judgeMode: string;
};

export const store = new Store<StoreType>();

export const setupStoreIPC = () => {
  ipcMainManager.handle("GET_STORE", async (e, storeKey, defaultValue) => {
    const storeData = await store.get(storeKey, defaultValue);
    return storeData;
  });
  ipcMainManager.handle("SET_STORE", async (e, storeKey, value) => {
    return store.set(storeKey, value);
  });
};
