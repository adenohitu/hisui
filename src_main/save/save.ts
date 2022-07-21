import { app } from "electron";
import Store from "electron-store";
import path from "path";
import { submitLanguage } from "../data/scraping/submitlang";
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
  submitLanguage: submitLanguage;
  // mosaicの状態保持
  WindowState: any;
  judgeMode: string;
  "compilerPath.cpp": string;
  // dockerPath
  dockerPath: string;
};
function getStorecwd() {
  if (app) {
    return app.getPath("userData");
  } else {
    return path.join(__dirname, "../../store");
  }
}
export const store = new Store<StoreType>({ cwd: getStorecwd() });
