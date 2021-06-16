import { createsampleViewapi } from "../createsampleview";
import { dashboardapi } from "../dashboardview";
import { editorViewapi } from "../editorview";
import { mainPageapi } from "../mainpageview";

type viewName = "main" | "editor" | "dashboard" | "case";
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
        mainPageapi.runWindowTop();
        break;
      case "editor":
        editorViewapi.runWindowTop();
        break;
      case "dashboard":
        dashboardapi.runWindowTop();
        break;
      case "case":
        createsampleViewapi.runWindowTop();
        break;
      default:
        break;
    }
    this.viewNow = viewName;
  }
}
export const changeViewapi = new changeView();
