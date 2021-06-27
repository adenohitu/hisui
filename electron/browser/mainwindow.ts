import { BrowserWindow } from "electron";

class mainWindow {
  win: null | BrowserWindow;
  constructor() {
    this.win = null;
  }
}
export const mainWindowApi = new mainWindow();
