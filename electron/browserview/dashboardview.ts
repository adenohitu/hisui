import { BrowserView, BrowserWindow } from "electron";
import * as isDev from "electron-is-dev";
import { menuSize } from "./default";
export class dashboard {
  /**
   * viewを保存
   * 表示されていない時はnull
   */
  dashboardView: BrowserView | null;
  private mainWindow: BrowserWindow | null;
  constructor() {
    this.dashboardView = null;
    this.mainWindow = null;
  }

  /**
   * BrowserViewを初期化する
   */
  async setupView(win: BrowserWindow | null) {
    if (!this.mainWindow && win) {
      this.mainWindow = win;
      this.dashboardView = new BrowserView({
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: __dirname + "/../preload.js",
        },
      });
      this.mainWindow?.addBrowserView(this.dashboardView);

      const newBounds = win?.getContentBounds();
      this.dashboardView.setBounds({
        x: menuSize,
        y: 0,
        width: newBounds.width - menuSize,
        height: newBounds.height,
      });
      this.dashboardView.setAutoResize({ width: false, height: false });

      if (isDev) {
        this.dashboardView.webContents.loadURL(
          "http://localhost:3000#/dashboard"
        );
      } else {
        // 'build/index.html'
        this.dashboardView.webContents.loadURL(
          `file://${__dirname}/../../index.html#/dashboard`
        );
      }

      win.on("resize", () => {
        this.windowSizeChange(win, this.dashboardView);
      });
    } else {
      return "alrady";
    }
  }

  /**
   * ウィンドウのDevtoolを開く
   */
  openDevTool() {
    this.dashboardView?.webContents.openDevTools({ mode: "detach" });
  }

  /**
   * dashboardViewを一番上に配置する
   */
  runWindowTop() {
    if (this.dashboardView && this.mainWindow) {
      this.mainWindow.setTopBrowserView(this.dashboardView);
    }
  }

  /**
   * 順位表データをアップデートする
   */
  runUpdateRankdata() {
    this.dashboardView?.webContents.send("updateDashboard_replay");
  }
  /**
   * windowの配置状態を初期化する
   */
  resetWindowState() {
    this.dashboardView?.webContents.send("resetWindowState");
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

export const dashboardapi = new dashboard();
