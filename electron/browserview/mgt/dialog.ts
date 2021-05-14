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
      mainPageapi.mainPageView?.webContents.send("dafaltContest");
      break;
    case "editor":
      editorViewapi.editorView?.webContents.send("dafaltContest");
      break;
    case "dashboard":
      dashboardapi.dashboardView?.webContents.send("dafaltContest");
      break;
    case "createSample":
      break;
    default:
      break;
  }
}
