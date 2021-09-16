import { createsampleViewapi } from "../createsampleview";
import { dashboardapi } from "../dashboardview";
import { editorViewapi } from "../editorview";
import { mainPageapi } from "../mainpageview";
import { changeViewapi } from "./changeview";

/**
 * 開いているViewで設定ダイアログを表示
 */
export function settingDialogOpen() {
  const nowWindow = changeViewapi.viewNow;
  switch (nowWindow) {
    case "main":
      mainPageapi.view?.webContents.send("dafaltContest");
      break;
    case "editor":
      editorViewapi.view?.webContents.send("dafaltContest");
      break;
    case "dashboard":
      dashboardapi.view?.webContents.send("dafaltContest");
      break;
    case "case":
      createsampleViewapi.createsampleView?.webContents.send("dafaltContest");
      break;
    default:
      break;
  }
}
