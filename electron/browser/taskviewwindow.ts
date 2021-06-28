//Copyright © 2021 adenohitu. All rights reserved.
import { app, BrowserView, BrowserWindow } from "electron";
import { getDefaultContestID } from "../clock/timer";
import { hisuiEvent } from "../event/event";
import { store } from "../save/save";
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
  nowTop: string | null;
  contestpageId: string | null;
  constructor() {
    this.view = {};
    this.win = null;
    this.nowTop = null;
    this.contestpageId = null;
  }
  open() {
    this.win = new BrowserWindow({
      width: store.get("window.taskView.width", 800),
      height: store.get("window.taskView.height", 600),
      x: store.get("window.taskView.x"),
      y: store.get("window.taskView.y"),
      titleBarStyle: "hidden",
      // opacity: 0.5,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });
    // this.win.webContents.openDevTools({ mode: "detach" });
    // ロード
    if (!app.isPackaged) {
      this.win.loadURL("http://localhost:3000#/taskview");
    } else {
      // 'build/index.html'
      this.win.loadURL(`file://${__dirname}/../index.html#/taskview`);
    }

    // this.win.setAlwaysOnTop(true);
    // taskViewにデフォルトのコンテストーページをセット
    this.setupContestPage();
    // 透過に関する設定
    // this.win.setOpacity(0.5);
    // this.win.setIgnoreMouseEvents(true);
    this.win.on("close", () => {
      //windowのサイズを保存
      //最大化されていても通常状態のサイズ 位置を保存
      store.set("window.taskView.height", this.win?.getNormalBounds().height);
      store.set("window.taskView.width", this.win?.getNormalBounds().width);
      store.set("window.taskView.x", this.win?.getNormalBounds().x);
      store.set("window.taskView.y", this.win?.getNormalBounds().y);
    });
    // Close後の処理
    this.win.on("closed", () => {
      this.win = null;
      // viewは閉じた時に全て消去される
      this.view = {};
    });
  }
  close() {
    this.win?.close();
  }
  // Viewが存在する場合フォーカスする
  async addView(id: string, url: string) {
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
      console.log(`${this.baseurl}${url}`);

      // 最上部にセット
      this.win.setTopBrowserView(createdView);
      this.nowTop = id;
      return "success";
    } else {
      this.win?.setTopBrowserView(this.view[id].view);
      this.nowTop = id;
      return "already";
    }
  }
  /**
   * 指定したViewを一番上に持ってくる
   */
  async changeViewTop(id: string) {
    if (this.win !== null) {
      this.win.setTopBrowserView(this.view[id].view);
    }
  }

  /**
   * viewをリロード
   */
  async reloadView(id: string) {
    this.view[id].view.webContents.reload();
  }
  /**
   * 開いた時のURLに戻す
   */
  async resetView(id: string) {
    this.view[id].view.webContents.loadURL(
      `${this.baseurl}${this.view[id].initUrl}}`
    );
  }
  /**
   * viewを閉じる
   */
  async removeView(id: string) {
    if (this.win !== null) {
      const view = this.view[id];
      this.win.removeBrowserView(view.view);
      delete this.view[id];
    }
  }

  /**
   * 登録されている全てのViewを削除
   */
  async allViewRemove() {
    if (this.win !== null) {
      Object.keys(this.view).forEach((key) => {
        this.win?.removeBrowserView(this.view[key].view);
      });
      this.view = {};
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
  /**
   * コンテストページのViewを開く
   * 起動時にデフォルトのコンテストのページを開く
   */
  async setupContestPage() {
    const DefaultContestID = getDefaultContestID();
    this.contestpageId = DefaultContestID;
    this.addView(DefaultContestID, DefaultContestID);
    /**
     * DefaultContestID-changeが変更されたらViewも更新
     */
    hisuiEvent.on("DefaultContestID-change", (arg) => {
      if (this.contestpageId) {
        this.removeView(this.contestpageId);
        this.addView(arg, arg);
        this.contestpageId = arg;
      }
    });
  }

  setuptaskViewIPC() {}
}
export const taskViewWindowApi = new taskViewWindow();
