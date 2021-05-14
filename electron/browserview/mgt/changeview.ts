import { dashboardapi } from "../dashboardview";
import { editorViewapi } from "../editorview";
import { mainPageapi } from "../mainpageview";

type viewName = "main" | "editor" | "dashboard" | "createSample";
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
      case "createSample":
        break;
      default:
        mainPageapi.runWindowTop();
        break;
    }
    this.viewNow = viewName;
  }
}
export const changeViewapi = new changeView();
