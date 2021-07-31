import Store from "electron-store";
import { languagetype } from "../file/extension";
type StoreType = {
  // mainwindowの状態
  "window.main.width": number;
  "window.main.height": number;
  "window.main.x": number;
  "window.main.y": number;
  "window.main.isMax": boolean;
  // taskViewWindowの状態
  "window.taskView.width": number;
  "window.taskView.height": number;
  "window.taskView.x": number;
  "window.taskView.y": number;
  // ファイル保存に関する状態
  saveDefaultFolder: string;
  defaultLanguage: languagetype;
  // mosaicの状態保持
  WindowState: any;
};

export const store = new Store<StoreType>();
