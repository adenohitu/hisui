import { BrowserView, BrowserWindow } from "electron";
import * as isDev from "electron-is-dev";
import { menuSize } from "./default";

export class mainPage {
  /**
   * viewを保存
   * 表示されていない時はnull
   */
  mainPageView: BrowserView | null;
  private mainWindow: BrowserWindow | null;
  constructor() {
    this.mainPageView = null;
    this.mainWindow = null;
  }

  /**
   * BrowserViewを初期化する
   */
  async setupView(win: BrowserWindow | null) {
    if (!this.mainWindow && win) {
      this.mainWindow = win;
      this.mainPageView = new BrowserView({
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: __dirname + "/../preload.js",
        },
      });
      this.mainWindow?.addBrowserView(this.mainPageView);

      const newBounds = win?.getContentBounds();
      this.mainPageView.setBounds({
        x: menuSize,
        y: 0,
        width: newBounds.width - menuSize,
        height: newBounds.height,
      });
      this.mainPageView.setAutoResize({ width: false, height: false });

      if (isDev) {
        this.mainPageView.webContents.loadURL("http://localhost:3000#/");
      } else {
        // 'build/index.html'
        this.mainPageView.webContents.loadURL(
          `file://${__dirname}/../../index.html#/`
        );
      }

      win.on("resize", () => {
        this.windowSizeChange(win, this.mainPageView);
      });
    } else {
      return "alrady";
    }
  }

  /**
   * ウィンドウのDevtoolを開く
   */
  openDevTool() {
    this.mainPageView?.webContents.openDevTools({ mode: "detach" });
  }

  /**
   * mainPageViewを一番上に配置する
   */
  runWindowTop() {
    if (this.mainPageView && this.mainWindow) {
      this.mainWindow.setTopBrowserView(this.mainPageView);
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

export const mainPageapi = new mainPage();
