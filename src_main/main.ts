/*!
 *======================================================================
 *Project Name : Hisui
 *Copyright © 2021 adenohitu. All rights reserved.
 *======================================================================
 */

import { app, BrowserWindow } from "electron";
import * as path from "path";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from "electron-devtools-installer";
import { store } from "./save/save";
import setmenu from "./menu/menu";
import { main_ipc } from "./ipc_main";
import {
  startCheckServiceStatus,
  stopCheckServiceStatus,
} from "./service/setvice";
import { updateSetup } from "./update/update";
import { mainPageapi } from "./browserview/mainpageview";
import { dashboardapi } from "./browserview/dashboardview";
import { editorViewapi } from "./browserview/editorview";
import { changeViewapi } from "./browserview/mgt/changeview";
import { createsampleViewapi } from "./browserview/createsampleview";
import { timerApi } from "./clock/timer";
import { hisuiEvent } from "./event/event";
import { taskViewWindowApi } from "./browser/taskviewwindow";
import { taskControlApi } from "./editor/control";
import { submissionsApi } from "./data/submissions";

export let win: null | BrowserWindow = null;

function createWindow() {
  win = new BrowserWindow({
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
    win.loadURL("http://localhost:3000#/leftmenu");
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html#/leftmenu`);
  }

  // win.loadURL(`file://${__dirname}/../index.html#/leftmenu`);

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
    // windowViewを閉じる
    createsampleViewapi.closeView();
    dashboardapi.closeView();
    mainPageapi.closeView();
    editorViewapi.closeView();
    // taskViewを閉じる
    taskViewWindowApi.close();
    taskControlApi.close();
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
    //フォーカスを当てる
  }
  win.show();
  //最大化状態の適用
  if (store.get("window.main.isMax")) {
    win.maximize();
  }
  if (store.get("window.main.width") === undefined) {
    win.maximize();
  }
  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  installExtension(REDUX_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));
  async function initView() {
    //editorをセットアップ
    editorViewapi.setupView(win);
    //dashboardをセットアップ
    dashboardapi.setupView(win);
    //mainページをセットアップ
    mainPageapi.setupView(win);
    //制約生成ツールをセットアップ
    createsampleViewapi.setupView(win);
    // taskViewWindowをセットアップ
    taskViewWindowApi.open();
    // timerの初期化
    timerApi.setup();
  }
  //初期Viewを指定
  initView().then(() => {
    changeViewapi.change("main");
    // createsampleViewapi.openDevTool();
    // timerをセットアップ

    timerApi.startTimer();
  });
  if (!app.isPackaged) {
    // win.webContents.openDevTools({ mode: "detach" });
  }
}

app.on("ready", () => {
  createWindow();
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
// ログインイベントが発行された時にウィンドウを再読み込み
hisuiEvent.on("login", async () => {
  win?.close();
  win?.once("closed", () => createWindow());
});
hisuiEvent.on("view-main-top", (arg) => {
  console.log(arg);
});
//ipcの呼び出し
main_ipc();
//メニューのセット
setmenu();
//オートアップデートのセットアップ
updateSetup();
// submissionのセットアップ
submissionsApi.setup();
