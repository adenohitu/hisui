import { taskViewWindowApi } from "../../browser/taskviewwindow";
import { win } from "../../main";
import { dashboardapi } from "../dashboardview";
import { editorViewapi } from "../editorview";
import { mainPageapi } from "../mainpageview";
/**
 * 全てのwebcontentsをリロードする
 */
export function reloadAllWebContents() {
  win?.webContents.reload();
  mainPageapi.view?.webContents.reload();
  editorViewapi.view?.webContents.reload();
  dashboardapi.view?.webContents.reload();
  Object.keys(taskViewWindowApi.view).forEach((id) => {
    taskViewWindowApi.view[id].view.webContents.reload();
  });
}
