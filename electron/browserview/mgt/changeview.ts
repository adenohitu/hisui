import { dashboardapi } from "../dashboardview";
import { editorapi } from "../editorview";
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
        editorapi.runWindowTop();
        break;
      case "dashboard":
        //切り替えと同時に更新をかける
        dashboardapi.runUpdateRankdata();
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
