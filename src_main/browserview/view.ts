import { app, BrowserView, BrowserWindow } from "electron";
import { IpcEventsKey } from "../ipc/events";
import { menuSize } from "./default";
const isDev = !app.isPackaged;
interface viewurl {
  dev: string;
  product: string;
}
export class view {
  /**
   * viewを保存
   * 表示されていない時はnull
   */
  view: BrowserView | null;
  private mainWindow: BrowserWindow | null;
  url: { dev: string; product: string };

  constructor(arg: viewurl) {
    this.view = null;
    this.mainWindow = null;
    this.url = arg;
  }

  /**
   * BrowserViewを初期化する
   */
  async setupView(win: BrowserWindow | null) {
    if (this.view === null && win !== null) {
      this.mainWindow = win;
      this.view = new BrowserView({
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: __dirname + "/../preload.js",
        },
      });
      win.addBrowserView(this.view);

      const newBounds = win.getContentBounds();
      this.view.setBounds({
        x: menuSize,
        y: 0,
        width: newBounds.width - menuSize,
        height: newBounds.height,
      });
      this.view.setAutoResize({ width: false, height: false });

      if (isDev) {
        this.view.webContents.loadURL(this.url.dev);
      } else {
        // 'build/index.html'
        this.view.webContents.loadURL(this.url.product);
      }

      win.on("resize", () => {
        this.windowSizeChange(this.mainWindow, this.view);
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
    if (this.view !== null && this.mainWindow !== null) {
      this.mainWindow.removeBrowserView(this.view);
      this.view = null;
      this.mainWindow = null;
    }
  }

  /**
   * ウィンドウのDevtoolを開く
   */
  openDevTool() {
    this.view?.webContents.openDevTools({ mode: "detach" });
  }

  /**
   * mainPageViewを一番上に配置する
   */
  runWindowTop() {
    if (this.view && this.mainWindow) {
      this.mainWindow.setTopBrowserView(this.view);
    }
  }

  private windowSizeChange(
    win: BrowserWindow | null,
    view: BrowserView | null
  ) {
    const newBounds = win?.getContentBounds();
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
  // ipcに関する関数

  /**
   * Viewでイベントを発行する
   */
  send(channel: string, ...args: any[]) {
    this.view?.webContents.send(channel, ...args);
  }
}
