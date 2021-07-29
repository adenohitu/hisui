import { win } from "../main";
import { taskViewWindowApi } from "./taskviewwindow";
type windowmode = "opacity" | "normal";
/**
 * windowの位置の設定
 */
export function setWindowMode(mode: windowmode) {
  if (mode === "normal") {
    const allwindowTop = (focus: string) => {
      if (checkfullscreen() === false) {
        if (focus === "main") {
          taskViewWindowApi.win?.moveTop();
          win?.moveTop();
        } else if (focus === "task") {
          win?.moveTop();
          taskViewWindowApi.win?.moveTop();
        }
      }
    };
    // eventの設定
    win?.on("focus", () => {
      allwindowTop("main");
    });
    taskViewWindowApi.win?.on("focus", () => {
      allwindowTop("task");
    });
  } else if (mode === "opacity") {
  }
}
/**
 * フルスクリーンになっているWindowがあるかチェック
 * あればtrue,なければfalse
 */
export function checkfullscreen() {
  if (win?.isFullScreen() === true) {
    return true;
  } else if (taskViewWindowApi.win?.isFullScreen() === true) {
    return true;
  } else {
    return false;
  }
}
