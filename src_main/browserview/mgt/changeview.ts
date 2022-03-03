import { hisuiEvent } from "../../event/event";
import { ipcMainManager } from "../../ipc/ipc";

export type viewName = "main" | "editor" | "dashboard" | "case";
/**
 * MainWindowのViewの状態を管理するAPI
 */
export class changeView {
  viewNow: null | viewName;
  constructor() {
    this.viewNow = null;
  }
  change(viewName: viewName) {
    switch (viewName) {
      case "main":
        // mainPageapi.runWindowTop();
        break;
      case "editor":
        // editorViewapi.runWindowTop();
        break;
      case "dashboard":
        // dashboardapi.runWindowTop();
        break;
      case "case":
        // createsampleViewapi.runWindowTop();
        break;
      default:
        break;
    }
    // hisui.d.tsを参照
    hisuiEvent.emit("view-main-top", viewName);
    this.viewNow = viewName;
  }
  setup() {
    hisuiEvent.on("view-main-top", (viewName) => {
      ipcMainManager.send("LISTENER_VIEW_TOP", viewName);
    });
  }
}
export const changeViewapi = new changeView();
