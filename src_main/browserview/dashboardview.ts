import { app, BrowserView, BrowserWindow } from "electron";
import { timeData } from "../clock/timer";
import { menuSize } from "./default";
const isDev = !app.isPackaged;

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
    if (this.dashboardView === null && win !== null) {
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
   * Viewを閉じる
   */
  async closeView() {
    if (this.dashboardView !== null && this.mainWindow !== null) {
      await this.mainWindow.removeBrowserView(this.dashboardView);
      this.dashboardView = null;
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
   * dashboardのデータ全てをアップデートする
   */
  runUpdatedata() {
    this.dashboardView?.webContents.send("updateDashboard_replay");
  }
  /**
   * windowの配置状態を初期化する
   */
  resetWindowState() {
    this.dashboardView?.webContents.send("resetWindowState");
  }
  sendTimerTick(time: timeData) {
    this.dashboardView?.webContents.send("TimerTick", time);
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
