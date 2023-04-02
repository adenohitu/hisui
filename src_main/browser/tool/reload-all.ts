import { appMain } from "../../main";
import { taskViewWindowApi } from "../taskviewwindow";

/**
 * 全てのwebcontentsをリロードする
 */
export function reloadAllWebContents() {
  appMain.win?.webContents.reload();
  // mainPageapi.view?.webContents.reload();
  // editorViewapi.view?.webContents.reload();
  // dashboardapi.view?.webContents.reload();
  Object.keys(taskViewWindowApi.view).forEach((id) => {
    taskViewWindowApi.view[id].view.webContents.reload();
  });
}
