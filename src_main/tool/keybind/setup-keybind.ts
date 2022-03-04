import { BrowserWindow } from "electron";
import { setMenu } from "../../menu/window-menu";

export const setupKeyBind = (win: BrowserWindow) => {
  win.webContents.on("before-input-event", (event, input) => {
    if (input.alt === true) {
      setMenu(true);
    } else {
      setMenu(false);
    }
  });
};
