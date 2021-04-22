/**
 *======================================================================
 *Project Name    : AtCoderGUI
 *File Name       : main.ts
 *Copyright © 2021 adenohitu. All rights reserved.
 *======================================================================
 */
import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as isDev from "electron-is-dev";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from "electron-devtools-installer";
import { store } from "./save/save";
import setmenu from "./menu/menu";
import { main_ipc } from "./ipc_main";

export let win: any = null;

function createWindow() {
  win = new BrowserWindow({
    width: store.get("window.width", 800),
    height: store.get("window.height", 600),
    x: store.get("window.x"),
    y: store.get("window.y"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: __dirname + "/preload.js",
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:3000");
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  win.on("closed", () => (win = null));

  //ウィンドウが閉じられるときに実行
  win.on("close", () => {
    //windowのサイズを保存
    //最大化されていても通常状態のサイズ 位置を保存
    store.set("window.height", win.getNormalBounds().height);
    store.set("window.width", win.getNormalBounds().width);
    store.set("window.x", win.getNormalBounds().x);
    store.set("window.y", win.getNormalBounds().y);
    //ウィンドウの最大化状態を保存する
    store.set("window.isMax", win.isMaximized());
  });
  // Hot Reloading
  if (isDev) {
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
  if (store.get("window.isMax")) {
    win.maximize();
  }

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  installExtension(REDUX_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.on("ready", createWindow);

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
//ipcの呼び出し
main_ipc();
//メニューのセット
setmenu();
