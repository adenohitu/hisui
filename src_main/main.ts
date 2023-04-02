/*!
 *======================================================================
 *Project Name : Hisui
 *Copyright © 2020-2023 adenohitu. All rights reserved.
 *======================================================================
 */

import { app, BrowserWindow } from "electron";
import path from "path/posix";
import { monitoringWebContents } from "./browser/monitoring/monitoring";
import { taskViewWindowApi } from "./browser/taskviewwindow";
import { setWindowSplit } from "./browser/tool/monitorsize";
import { reloadAllWebContents } from "./browser/tool/reload-all";
import { timerApi } from "./clock/timer";
import { codeTestApi } from "./code-test/codetest";
import { submissionDBApi } from "./data/submission-db";
import { submissionsApi } from "./data/submissions";
import { SetIPCgetSubmitLangOption } from "./data/submit";
import { taskControlApi } from "./editor/control";
import { monacoSettingApi } from "./editor/monaco";
import { hisuiEvent } from "./event/event";
import { setupDefaultFolder } from "./file/file";
import { load_ipc } from "./ipc/ipc_main";
import { setupContextMenu } from "./menu/context-menu";
import { setMenu } from "./menu/window-menu";
import { atcoderMgtApi } from "./plugin/atcoder/atcoder-mgt";
import { pluginloader } from "./plugin/loader";
import { store } from "./save/save";
import { setupStoreIPC } from "./save/store-ipc";
import { setBrowserCoockie } from "./save/utility/session";
import { setupAutoUpdater } from "./service/autoupdate";
import { setupKeyBind } from "./tool/keybind/setup-keybind";
import { setupProtocols } from "./tool/protocols";
import { setupStoreDockerDefaultValue } from "./vm-system/docker-path";

class AppMain {
  constructor() {
    this.setup();
  }
  win: null | BrowserWindow = null;
  /**
   * 起動前の初期設定
   */
  setup() {
    // WebContentsの監視
    monitoringWebContents();
    // 自動更新の初期設定
    setupAutoUpdater();
    // Windowの起動
    this.appStart();
  }
  /**
   * 起動のメイン処理
   */
  appStart() {
    // Windowの起動予約
    app.on("ready", () => {
      if (this.win === null) {
        this.createWindow();
      }
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("activate", () => {
      if (this.win === null) {
        this.createWindow();
      }
    });
    // EditorのMainProcessコントローラの初期設定
    monacoSettingApi.setup();
    // StoreにアクセスするIPCの初期化
    setupStoreIPC();
    //ipcの呼び出し
    load_ipc();
    //メニューのセット
    setMenu();
    // submissionのセットアップ
    submissionsApi.setup();
    // 保存ファイルの設定
    setupDefaultFolder();
    // 右クリックメニュのセットアップ
    setupContextMenu();
    // hisui-service://をシステムに登録
    setupProtocols();
    // 提出可能言語を取得するIPC
    SetIPCgetSubmitLangOption();
    // プラグインの初期設定
    pluginloader();
    // CodeTestAPIのセットアップ
    codeTestApi.codeTestSetup();
    // Storeに初期値をセット
    setupStoreDockerDefaultValue();
    // 提出一覧の初期設定
    submissionDBApi.setupEvent();
    // atcoderMgtApiの初期設定
    atcoderMgtApi.setupIPCMain();
  }

  /**
   * MainWindowの作成
   */
  createWindow() {
    this.win = new BrowserWindow({
      show: false,
      width: store.get("window.main.width", 800),
      height: store.get("window.main.height", 600),
      x: store.get("window.main.x"),
      y: store.get("window.main.y"),
      minHeight: 360,
      minWidth: 500,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        preload: path.resolve(__dirname, "../preload/preload.js"),
      },
    });

    if (!app.isPackaged) {
      this.win.loadURL("http://localhost:3000#/mainwindow-root");
    } else {
      // 'build/index.html'
      this.win.loadURL(
        `file://${__dirname}/../src/index.html#/mainwindow-root`
      );
    }

    this.win.on("closed", () => (this.win = null));

    //ウィンドウが閉じられるときに実行
    this.win.on("close", () => {
      //windowのサイズを保存
      //最大化されていても通常状態のサイズ 位置を保存
      store.set("window.main.height", this.win?.getNormalBounds().height);
      store.set("window.main.width", this.win?.getNormalBounds().width);
      store.set("window.main.x", this.win?.getNormalBounds().x);
      store.set("window.main.y", this.win?.getNormalBounds().y);
      //ウィンドウの最大化状態を保存する
      store.set("window.main.isMax", this.win?.isMaximized());

      //timerをリセット
      timerApi.clearTimer();
      // taskViewを閉じる
      taskControlApi.close();
      taskViewWindowApi.close();
      //statusCheckを止める
    });
    // Hot Reloading
    if (!app.isPackaged) {
      // 'node_modules/.bin/electronPath'
      require("electron-reload")(__dirname, {
        electron: path.join(
          __dirname,
          "..",
          "..",
          "node_modules",
          ".bin",
          "electron"
        ),
        forceHardReset: true,
        hardResetMethod: "exit",
      });
    }
    this.win.once("ready-to-show", () => {
      this.win?.show();
    });
    //最大化状態の適用
    if (store.get("window.main.isMax")) {
      this.win.maximize();
    }
    // DevTools
    // installExtension([REACT_DEVELOPER_TOOLS])
    //   .then((name) => console.log(name))
    //   .catch((err) => console.log(err));
    async function initView() {
      Promise.all([
        // taskViewWindowをセットアップ
        taskViewWindowApi.open(),
      ]).then(() => {
        if (store.get("window.main.width") === undefined) {
          setWindowSplit();
        }
      });
      // timerの初期化
      timerApi.setup();
    }
    //初期Viewを指定
    initView().then(() => {
      // createsampleViewapi.openDevTool();
      // timerをセットアップ
      timerApi.startTimer();
      // submissionsの自動更新を開始
      // submissionsApi.startSubmissionsTimer();
      // 保存してあるセッションをViewに適応
      setBrowserCoockie();
      // windowの位置のセットアップ
      // setWindowMode("normal");
    });
    if (!app.isPackaged) {
      // win.webContents.openDevTools({ mode: "detach" });
    }
    // キーボードのイベントを監視するセットアップ
    setupKeyBind(this.win);
  }
  /**
   * 複数インスタンスの禁止
   */
  checkSingleInstance() {
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      app.exit();
    } else {
      app.on("second-instance", (_e, argv) => {
        if (this.win !== null) {
          taskViewWindowApi.win?.focus();
          this.win.focus();
        }
      });
    }
  }
  /**
   * ログイン・ログアウトイベントが発行された時にウィンドウを再読み込み
   */
  loginReload() {
    hisuiEvent.on("login", async () => {
      reloadAllWebContents();
    });
    hisuiEvent.on("logout", async () => {
      reloadAllWebContents();
    });
  }
}

// エントリーポイント
export const appMain = new AppMain();
