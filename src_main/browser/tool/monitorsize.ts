import { app, screen } from "electron";
import { win } from "../../main";
import { taskViewWindowApi } from "../taskviewwindow";

/**
 * Workエリアを左右に分割しWindowをセット
 */
export const setWindowSplit = () => {
  if (app.isReady()) {
    if (win !== null) {
      const displayStatus = screen.getPrimaryDisplay();
      const centerwidth = Math.floor(displayStatus.workArea.width / 2);
      // const leftWindowSize={x:}
      const rightWindowSize = {};
    } else {
      console.log("windowClosed");
    }
  } else {
    console.log("ElectronAppisnotReady");
  }
};

export const logMonitorSize = () => {
  //   const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  console.log(screen.getPrimaryDisplay());
  console.log(win?.getBounds());
  console.log(taskViewWindowApi.win?.getBounds());
};
