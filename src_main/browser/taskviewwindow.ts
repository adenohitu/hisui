//Copyright © 2021-2022 adenohitu. All rights reserved.
import { app, BrowserView, BrowserWindow } from "electron";
import { contestDataApi } from "../data/contestdata";
import { hisuiEvent } from "../event/event";
import { ipcMainManager } from "../ipc/ipc";
import { win } from "../main";
import { store } from "../save/save";
import { baseAtCoderUrl } from "../static";
import { logger } from "../tool/logger/logger";
// atcoderのページを開くためのWindow
// 問題やコンテストホームページを表示する
// toolbarの分、viewの上にマージンを設定するための値
const windowTopMargin = (process.platform === "darwin" && 28) || 31;
export class taskViewWindow {
  win: null | BrowserWindow;
  // idはTaskScreenNameを入れる
  // 例外としてContestのホームページの時は
  // contestNameを入れる
  // initUrlはview開くときに指定したURL
  // urlはAtcoder.jp/contests/の後のパスを入れる
  view: { [id: string]: { initUrl: string; view: BrowserView } };

  nowTop: string | null;
  nowPrimaryViewId: string | null;
  contestpageId: string | null;

  constructor() {
    this.view = {};
    this.win = null;
    this.nowTop = null;
    this.nowPrimaryViewId = null;
    this.contestpageId = null;
    this.setupIPC();
  }

  /**
   * windowを開く
   */
  async open() {
    this.win = new BrowserWindow({
      show: false,
      width: store.get("window.taskView.width", 800),
      height: store.get("window.taskView.height", 600),
      x: store.get("window.taskView.x"),
      y: store.get("window.taskView.y"),
      minHeight: 360,
      minWidth: 500,
      titleBarStyle: "hidden",
      trafficLightPosition: { x: 6, y: 6 },
      titleBarOverlay: { color: "#1E1E1E" },
      // opacity: 0.5,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: __dirname + "/../preload.js",
      },
    });
    this.win.once("ready-to-show", () => {
      this.win?.show();
    });
    // Plugin用のEvent
    hisuiEvent.emit("setup-addView");
    this.setupLibManegimentView();
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
      // 全て閉じる
      this.allViewRemove();
      // メインも閉じる
    });
    // Close後の処理
    this.win.on("closed", () => {
      this.nowTop = null;
      this.win = null;
      // viewは閉じた時に全て消去される
      this.view = {};
      win?.close();
    });
    // ロード
    if (!app.isPackaged) {
      return this.win.loadURL("http://localhost:3000#/taskview");
    } else {
      // 'build/index.html'
      return this.win.loadURL(`file://${__dirname}/../../index.html#/taskview`);
    }
  }
  setupIPC() {
    // taskViewのURLを初期値に戻す
    ipcMainManager.on("RUN_NOWTASKVIEW_RESET", () => {
      if (this.nowTop) {
        this.resetView(this.nowTop);
      }
    });
    ipcMainManager.on("RUN_CHANGE_TASKVIEW", (e, id: string) => {
      this.changeViewTop(id);
    });
    ipcMainManager.on("OPEN_SUBMISSION_PAGE", (e, url) => {
      if (this.contestpageId) {
        this.view[this.contestpageId].view.webContents.loadURL(url);
        this.changeViewTop(this.contestpageId);
      }
    });
    ipcMainManager.on("RUN_CHANGE_PRIMARY_VIEW", (e) => {
      this.changePrimaryView();
    });
  }
  /**
   * Windowを閉じる
   */
  close() {
    this.win?.close();
  }

  // Viewが存在する場合フォーカス(setTop)する
  async addView(
    id: string,
    url: string,
    preloadURI?: string,
    primary: boolean = false
  ) {
    if (!(id in this.view) && this.win !== null) {
      logger.info(`CreateView id:${id} initURL:${url}`, "TaskViewWindowAPI");

      const createdView = new BrowserView({
        webPreferences: {
          preload:
            (preloadURI !== undefined && preloadURI) ||
            __dirname + "/preload/atcoder-preload.js",
          nodeIntegration: false,
        },
      });
      // TaskViewWindowにViewを登録
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
      logger.info(`ViewOpen id:${id}`, "TaskViewWindowAPI");

      // 最上部にセット
      this.changeViewTop(id, primary);
      const loading = await createdView.webContents.loadURL(url);
      return loading;
    } else {
      // 最上部にセット
      this.changeViewTop(id, primary);
      logger.info(`ViewOpen SetTop id:${id}`, "TaskViewWindowAPI");
      return "already";
    }
  }

  /**
   * 指定したViewを一番上に持ってくる
   */
  async changeViewTop(id: string, primary: boolean = false) {
    if (this.win !== null) {
      this.nowTop = id;
      this.win.setTopBrowserView(this.view[id].view);
      // primaryIDを更新
      if (primary) {
        this.changePrimaryID(id);
      }
    }
  }
  async changePrimaryID(id: string | null) {
    this.nowPrimaryViewId = id;
    this.win?.webContents.send("LISTENER_NOW_PRIMARY_VIEW", id);
  }
  /**
   * nowPrimaryViewIdのVIEWに戻す
   */
  async changePrimaryView() {
    if (this.nowPrimaryViewId) {
      this.changeViewTop(this.nowPrimaryViewId);
      this.resetView(this.nowPrimaryViewId);
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
    logger.info(
      `ResetView id:${id} initURL:${this.view[id].initUrl}`,
      "TaskViewWindowAPI"
    );

    if (this.view[id].initUrl !== this.view[id].view.webContents.getURL()) {
      this.view[id].view.webContents.loadURL(`${this.view[id].initUrl}`);
    }
  }
  /**
   * TopのDevToolを開く
   */
  async openTopDevTool() {
    if (this.nowTop) this.view[this.nowTop].view.webContents.openDevTools();
  }

  /**
   * viewを閉じる
   */
  async removeView(id: string) {
    if (this.win !== null) {
      const view = this.view[id];
      if (view !== undefined) {
        this.win.removeBrowserView(view.view);
        logger.info(`CloseView id:${id}`, "TaskViewWindowAPI");
        delete this.view[id];
        if (this.nowPrimaryViewId === id) {
          this.changePrimaryID(null);
        }
      }
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
    const DefaultContestID = contestDataApi.getDefaultContestID();
    this.contestpageId = DefaultContestID;

    const contestMainPageURL = `${baseAtCoderUrl}${DefaultContestID}`;
    this.addView(DefaultContestID, contestMainPageURL);
    /**
     * DefaultContestID-changeが変更されたらViewも更新
     */
    hisuiEvent.on("DefaultContestID-change", (arg) => {
      if (this.contestpageId) {
        this.removeView(this.contestpageId);
        const contestMainPageURL = `${baseAtCoderUrl}${arg}`;
        this.addView(arg, contestMainPageURL);
        this.contestpageId = arg;
      }
    });
  }
  // 問題一覧をTaskViewに表示する
  async openTasksPage() {
    if (this.contestpageId) {
      const taskListPageURL = `${baseAtCoderUrl}${this.contestpageId}/tasks`;
      this.view[this.contestpageId].view.webContents.loadURL(taskListPageURL);
      this.changeViewTop(this.contestpageId);
    }
  }
  /**
   * library managementPage のセットアップ
   */
  async setupLibManegimentView() {
    // ロード
    if (!app.isPackaged) {
      return this.addView(
        "lib-management",
        "http://localhost:3000#/lib-management",
        __dirname + "/../preload.js"
      );
    } else {
      return this.addView(
        "lib-management",
        `file://${__dirname}/../../index.html#/lib-management`,
        __dirname + "/../preload.js"
      );
    }
  }
}
export const taskViewWindowApi = new taskViewWindow();
