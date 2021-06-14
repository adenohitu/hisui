import { app, BrowserView, BrowserWindow } from "electron";
import { menuSize } from "./default";
const isDev = !app.isPackaged;

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
    if (this.mainPageView === null && win !== null) {
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
      return "success";
    } else {
      return "alrady";
    }
  }

  /**
   * Viewを閉じる
   */
  async closeView() {
    if (this.mainPageView !== null && this.mainWindow !== null) {
      console.log("close");

      await this.mainWindow.removeBrowserView(this.mainPageView);
      this.mainPageView = null;
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
  openLoginDialog() {
    this.runWindowTop();
    this.mainPageView?.webContents.send("loginOpen");
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
