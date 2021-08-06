import Store from "electron-store";
import { languagetype } from "../file/extension";
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
  // mosaicの状態保持
  WindowState: any;
};

export const store = new Store<StoreType>();
