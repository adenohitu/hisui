//Copyright © 2021 adenohitu. All rights reserved.
import { app, BrowserView, BrowserWindow } from "electron";
// atcoderのページを開くためのWindow
// 問題やコンテストホームページを表示する

// const isDev = !app.isPackaged;
// toolbarの分、viewの上にマージンを設定するための値
const windowTopMargin = 28;
export class taskViewWindow {
  private baseurl = "https://atcoder.jp/contests/";
  win: null | BrowserWindow;
  // idはTaskScreenNameを入れる
  // 例外としてContestのホームページの時は
  // contestNameを入れる
  // initUrlはview開くときに指定したURL
  // urlはAtcoder.jp/contests/の後のパスを入れる
  view: { [id: string]: { initUrl: string; view: BrowserView } };
  constructor() {
    this.view = {};
    this.win = null;
  }
  open() {
    this.win = new BrowserWindow({
      // titleBarStyle: "hiddenInset",
      // opacity: 0.5,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });
    this.win.webContents.openDevTools();
    // ロード
    if (!app.isPackaged) {
      this.win.loadURL("http://localhost:3000#/taskview");
    } else {
      // 'build/index.html'
      this.win.loadURL(`file://${__dirname}/../index.html#/taskview`);
    }

    // this.win.setAlwaysOnTop(true);
    this.addView("abc199_a", "abc205/tasks/abc205_a");
  }
  close() {
    this.win?.destroy();
    this.win = null;
  }

  addView(id: string, url: string) {
    if (!(id in this.view) && this.win !== null) {
      console.log("run");

      const createdView = new BrowserView({
        webPreferences: {
          nodeIntegration: false,
        },
      });
      this.win.addBrowserView(createdView);
      // listに登録
      this.view[id] = {
        initUrl: url,
        view: createdView,
      };
      // windowの初期設定
      const newBounds = this.win.getContentBounds();
      createdView.setBounds({
        x: 0,
        y: windowTopMargin,
        width: newBounds.width,
        height: newBounds.height - windowTopMargin,
      });
      createdView.setAutoResize({ width: false, height: false });
      // リサイズのバグがあるため実装
      // electron/electron ＃22174
      this.win.on("resize", () => {
        if (this.win !== null) {
          this.windowSizeChange(this.win, createdView);
        }
      });
      // ページをロード
      createdView.webContents.loadURL(`${this.baseurl}${url}`);
      return "success";
    } else {
      return "alrady";
    }
  }

  // リサイズのバグがあるため実装
  // electron/electron ＃22174
  private windowSizeChange(win: BrowserWindow, view: BrowserView | null) {
    const newBounds = win.getContentBounds();
    if (view && newBounds) {
      view.setBounds({
        x: 0,
        y: windowTopMargin,
        width: newBounds.width,
        height: newBounds.height - windowTopMargin,
      });
      return "success";
    } else {
      return "viewNull";
    }
  }
}
export const taskViewWindowApi = new taskViewWindow();