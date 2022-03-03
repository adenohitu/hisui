/*!
 *======================================================================
 *Project Name : Hisui
 *Copyright © 2021-2022 adenohitu. All rights reserved.
 *======================================================================
 */

import { app, BrowserWindow } from "electron";
import * as path from "path";
// import installExtension, {
//   REACT_DEVELOPER_TOOLS,
//   REDUX_DEVTOOLS,
// } from "electron-devtools-installer";
import { setupStoreIPC, store } from "./save/save";
import { load_ipc } from "./ipc/ipc_main";
import {
  startCheckServiceStatus,
  stopCheckServiceStatus,
} from "./service/setvice";
import { updateSetup } from "./update/update";
import { changeViewapi } from "./browserview/mgt/changeview";
import { timerApi } from "./clock/timer";
import { hisuiEvent } from "./event/event";
import { taskViewWindowApi } from "./browser/taskviewwindow";
import { taskControlApi } from "./editor/control";
import { submissionsApi } from "./data/submissions";
import { setBrowserCoockie } from "./save/utility/session";
import { setupDefaultFolder } from "./file/file";
import { monitoringWebContents } from "./browser/monitoring/monitoring";
import { monacoSettingApi } from "./editor/monaco";
import { reloadAllWebContents } from "./browserview/mgt/reload-all";
import { setupContextMenu } from "./menu/context-menu";
import { setupProtocols } from "./tool/protocols";
import { setMenu } from "./menu/window-menu";
import { setWindowSplit } from "./browser/tool/monitorsize";
import { SetIPCgetSubmitLangOption } from "./data/submit";

// webcontentsの監視の開始
monitoringWebContents();

export let win: null | BrowserWindow = null;

function createWindow() {
  win = new BrowserWindow({
    show: false,
    width: store.get("window.main.width", 800),
    height: store.get("window.main.height", 600),
    x: store.get("window.main.x"),
    y: store.get("window.main.y"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: __dirname + "/preload.js",
    },
  });

  if (!app.isPackaged) {
    win.loadURL("http://localhost:3000#/mainwindow-root");
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html#/mainwindow-root`);
  }

  win.on("closed", () => (win = null));

  //ウィンドウが閉じられるときに実行
  win.on("close", () => {
    //windowのサイズを保存
    //最大化されていても通常状態のサイズ 位置を保存
    store.set("window.main.height", win?.getNormalBounds().height);
    store.set("window.main.width", win?.getNormalBounds().width);
    store.set("window.main.x", win?.getNormalBounds().x);
    store.set("window.main.y", win?.getNormalBounds().y);
    //ウィンドウの最大化状態を保存する
    store.set("window.main.isMax", win?.isMaximized());

    //timerをリセット
    timerApi.clearTimer();
    // submissionsの自動更新を停止
    submissionsApi.stopSubmissionsTimer();
    // taskViewを閉じる
    taskControlApi.close();
    taskViewWindowApi.close();
    //statusCheckを止める
    stopCheckServiceStatus();
  });
  // updateChack();
  startCheckServiceStatus();
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
  win.once("ready-to-show", () => {
    win?.show();
  });
  //最大化状態の適用
  if (store.get("window.main.isMax")) {
    win.maximize();
  }
  // // DevTools
  // installExtension(REACT_DEVELOPER_TOOLS)
  //   .then((name) => console.log(`Added Extension:  ${name}`))
  //   .catch((err) => console.log("An error occurred: ", err));

  // installExtension(REDUX_DEVTOOLS)
  //   .then((name) => console.log(`Added Extension:  ${name}`))
  //   .catch((err) => console.log("An error occurred: ", err));
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
    changeViewapi.change("main");
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
}

// 複数インスタンスの禁止
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.exit();
} else {
  app.on("second-instance", (_e, argv) => {
    if (win !== null) {
      taskViewWindowApi.win?.focus();
      win.focus();
    }
  });
}

app.on("ready", () => {
  if (win === null) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
// ログイン・ログアウトイベントが発行された時にウィンドウを再読み込み
hisuiEvent.on("login", async () => {
  reloadAllWebContents();
});
hisuiEvent.on("logout", async () => {
  reloadAllWebContents();
});
changeViewapi.setup();
monacoSettingApi.setup();
// StoreにアクセスするIPCの初期化
setupStoreIPC();
//ipcの呼び出し
load_ipc();
//メニューのセット
setMenu();
//オートアップデートのセットアップ
updateSetup();
// submissionのセットアップ
submissionsApi.setup();
// 保存ファイルの設定
setupDefaultFolder();
// setupClangd().then((arg) => {
//   console.log(arg);
//   LSPsetup(arg);
// });
setupContextMenu();
// hisui-service://をシステムに登録
setupProtocols();
// 提出可能言語を取得するIPC
SetIPCgetSubmitLangOption();
