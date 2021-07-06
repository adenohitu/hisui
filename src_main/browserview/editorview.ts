import { app, BrowserView, BrowserWindow } from "electron";
import { menuSize } from "./default";
const isDev = !app.isPackaged;

export class editor {
  /**
   * viewを保存
   * 表示されていない時はnull
   */
  editorView: BrowserView | null;
  private mainWindow: BrowserWindow | null;
  constructor() {
    this.editorView = null;
    this.mainWindow = null;
  }

  /**
   * BrowserViewを初期化する
   */
  async setupView(win: BrowserWindow | null) {
    if (this.editorView === null && win !== null) {
      this.mainWindow = win;
      this.editorView = new BrowserView({
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: __dirname + "/../preload.js",
        },
      });
      this.mainWindow?.addBrowserView(this.editorView);

      const newBounds = win?.getContentBounds();
      this.editorView.setBounds({
        x: menuSize,
        y: 0,
        width: newBounds.width - menuSize,
        height: newBounds.height,
      });
      this.editorView.setAutoResize({ width: false, height: false });

      if (isDev) {
        this.editorView.webContents.loadURL("http://localhost:3000#/editor");
      } else {
        // 'build/index.html'
        this.editorView.webContents.loadURL(
          `file://${__dirname}/../../index.html#/editor`
        );
      }

      win.on("resize", () => {
        this.windowSizeChange(win, this.editorView);
      });
    } else {
      return "alrady";
    }
  }

  /**
   * Viewを閉じる
   */
  async closeView() {
    if (this.editorView !== null && this.mainWindow !== null) {
      await this.mainWindow.removeBrowserView(this.editorView);
      this.editorView = null;
    }
  }

  /**
   * ウィンドウのDevtoolを開く
   */
  openDevTool() {
    this.editorView?.webContents.openDevTools({ mode: "detach" });
  }

  /**
   * editorViewを一番上に配置する
   */
  runWindowTop() {
    if (this.editorView && this.mainWindow) {
      this.mainWindow.setTopBrowserView(this.editorView);
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

export const editorViewapi = new editor();