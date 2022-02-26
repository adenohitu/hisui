import { app, screen } from "electron";
import { win } from "../../main";
import { logger } from "../../tool/logger/logger";
import { taskViewWindowApi } from "../taskviewwindow";

/**
 * Workエリアを左右に分割しWindowをセット
 */
export const setWindowSplit = () => {
  if (app.isReady()) {
    if (win !== null) {
      // 中間を計算、Windowの位置を作成
      const displayStatus = screen.getPrimaryDisplay();
      const centerwidth = Math.floor(displayStatus.workArea.width / 2);
      const leftWindowSize = {
        x: displayStatus.workArea.x,
        y: displayStatus.workArea.y,
        width: centerwidth,
        height: displayStatus.workArea.height,
      };
      const rightWindowSize = {
        x: centerwidth,
        y: displayStatus.workArea.y,
        width: displayStatus.workArea.width - centerwidth,
        height: displayStatus.workArea.height,
      };
      // windowにセット
      win.setBounds(leftWindowSize);
      taskViewWindowApi.win?.setBounds(rightWindowSize);
      logger.info("windowSetSplit", "WindowManager");
    } else {
      logger.error("windowClosed", "WindowManager");
    }
  } else {
    logger.error("ElectronAppisnotReady", "WindowManager");
  }
};

export const logMonitorSize = () => {
  //   const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  console.log(screen.getPrimaryDisplay());
  console.log(win?.getBounds());
  console.log(taskViewWindowApi.win?.getBounds());
};
