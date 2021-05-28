import { BrowserView, BrowserWindow } from "electron";
import * as isDev from "electron-is-dev";
import { menuSize } from "./default";

export class createsample {
  /**
   * viewを保存
   * 表示されていない時はnull
   */
  createsampleView: BrowserView | null;
  private mainWindow: BrowserWindow | null;
  constructor() {
    this.createsampleView = null;
    this.mainWindow = null;
  }

  /**
   * BrowserViewを初期化する
   */
  async setupView(win: BrowserWindow | null) {
    if (!this.mainWindow && win) {
      this.mainWindow = win;
      this.createsampleView = new BrowserView({
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: __dirname + "/../preload.js",
        },
      });
      this.mainWindow?.addBrowserView(this.createsampleView);

      const newBounds = win?.getContentBounds();
      this.createsampleView.setBounds({
        x: menuSize,
        y: 0,
        width: newBounds.width - menuSize,
        height: newBounds.height,
      });
      this.createsampleView.setAutoResize({ width: false, height: false });

      if (isDev) {
        this.createsampleView.webContents.loadURL(
          "http://localhost:3000#/case"
        );
      } else {
        // 'build/index.html'
        this.createsampleView.webContents.loadURL(
          `file://${__dirname}/../../index.html#/case`
        );
      }

      win.on("resize", () => {
        this.windowSizeChange(win, this.createsampleView);
      });
    } else {
      return "alrady";
    }
  }

  /**
   * ウィンドウのDevtoolを開く
   */
  openDevTool() {
    this.createsampleView?.webContents.openDevTools({ mode: "detach" });
  }

  /**
   * createsampleViewを一番上に配置する
   */
  runWindowTop() {
    if (this.createsampleView && this.mainWindow) {
      this.mainWindow.setTopBrowserView(this.createsampleView);
    }
  }

  private windowSizeChange(win: BrowserWindow, view: BrowserView | null) {
    const newBounds = win.getContentBounds();
    if (view && newBounds) {
      view.setBounds({
        x: menuSize,
        y: 0,
        width: newBounds.width - menuSize,
        height: newBounds.height,
      });
      return "success";
    } else {
      return "viewNull";
    }
  }
}

export const createsampleViewapi = new createsample();
