import { taskViewWindowApi } from "../taskviewwindow";
import { win } from "../../main";

/**
 * 全てのwebcontentsをリロードする
 */
export function reloadAllWebContents() {
  win?.webContents.reload();
  // mainPageapi.view?.webContents.reload();
  // editorViewapi.view?.webContents.reload();
  // dashboardapi.view?.webContents.reload();
  Object.keys(taskViewWindowApi.view).forEach((id) => {
    taskViewWindowApi.view[id].view.webContents.reload();
  });
}
