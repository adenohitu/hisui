import { app, Menu } from "electron";
import { setBrowserCoockie } from "../save/utility/session";
import { createsampleViewapi } from "../browserview/createsampleview";
import { dashboardapi } from "../browserview/dashboardview";
import { editorViewapi } from "../browserview/editorview";
import { mainPageapi } from "../browserview/mainpageview";
import { Atcoder } from "../data/atcoder";
import { submissionsApi } from "../data/submissions";
import { taskControlApi } from "../editor/control";
import { urlOpen } from "../tool/openExternal";
import openTaskAll from "../tool/open_taskAll";
import { setWindowSplit } from "../browser/tool/monitorsize";
import { ipcMainManager } from "../ipc/ipc";
import { resetMosaicState } from "../save/utility/mosaic-state";
const isMac = process.platform === "darwin";
const packd = app.isPackaged;
// ElectronのMenuの設定
const template: any = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            // { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: "ファイル",
    submenu: [
      {
        label: "Editorの設定を開く",
        click(item: any, focusedWindow: any, event: any) {
          ipcMainManager.send("LISTENER_OPEN_EDITOR_SETTING_DIALOG");
        },
      },
      {
        label: "保存する",
        click(item: any, focusedWindow: any, event: any) {
          taskControlApi.saveNowTop();
        },
        accelerator: process.platform === "darwin" ? "command+S" : "ctrl+S",
      },
      isMac ? { role: "close" } : { role: "quit" },
    ],
  },
  ...(!packd
    ? [
        {
          label: "開発",
          submenu: [
            {
              label: "test",
              click(item: any, focusedWindow: any, event: any) {
                if (taskControlApi.nowTop) {
                  taskControlApi.taskAll[taskControlApi.nowTop]
                    .getAllSamplecase()
                    .then((r) => console.log(r));
                }
              },
            },
            {
              label: "AppRelaunch",
              click(item: any, focusedWindow: any, event: any) {
                app.relaunch();
                app.quit();
              },
            },
            {
              label: "extest",
              click(item: any, focusedWindow: any, event: any) {
                (async () => {
                  if (taskControlApi.nowTop)
                    console.log(
                      await taskControlApi.taskAll[
                        taskControlApi.nowTop
                      ].getAllSamplecase()
                    );
                })();
              },
            },
            {
              label: "DevToolsOnMainwindow",
              click(item: any, focusedWindow: any, event: any) {
                focusedWindow.webContents.openDevTools({ mode: "detach" });
              },
            },
            {
              label: "DevToolsOnMainpage",
              click(item: any, focusedWindow: any, event: any) {
                mainPageapi.openDevTool();
              },
            },
            {
              label: "DevToolsOnDashboard",
              click(item: any, focusedWindow: any, event: any) {
                dashboardapi.openDevTool();
              },
            },
            {
              label: "DevToolsOnCaseCreate",
              click(item: any, focusedWindow: any, event: any) {
                createsampleViewapi.openDevTool();
              },
            },
            {
              label: "DevToolsOnEditor",
              click(item: any, focusedWindow: any, event: any) {
                editorViewapi.openDevTool();
              },
            },
          ],
        },
      ]
    : []),
  {
    label: "編集",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
          ]
        : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
    ],
  },
  // { role: 'editMenu' }
  {
    label: "ユーザー",
    submenu: [
      { type: "separator" },
      {
        label: "login",
        click(item: any, focusedWindow: any, event: any) {
          mainPageapi.openLoginDialog();
        },
      },
      {
        label: "logout",
        click(item: any, focusedWindow: any, event: any) {
          Atcoder.runLogout();
        },
      },
      {
        label: "セッション同期",
        click(item: any, focusedWindow: any, event: any) {
          setBrowserCoockie();
        },
      },
    ],
  },
  {
    label: "コンテスト",
    submenu: [
      { type: "separator" },
      {
        label: "Select Contest",
        click(item: any, focusedWindow: any, event: any) {
          mainPageapi.openDafaultContestDialog();
        },
      },
      { type: "separator" },
      {
        label: "ブラウザで全ての問題を開く",
        click(item: any, focusedWindow: any, event: any) {
          openTaskAll();
        },
      },
    ],
  },
  // { role: 'viewMenu' }
  {
    label: "表示",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  {
    label: "表示",
    submenu: [
      // { role: "reload" },
      // { role: "forceReload" },
      {
        label: "提出一覧を更新",
        click(item: any, focusedWindow: any, event: any) {
          submissionsApi.updateSubmissions();
        },
      },
    ],
  },
  {
    label: "ウィンドウ",
    submenu: [
      {
        label: "エディターの配置を初期化する",
        click(item: any, focusedWindow: any, event: any) {
          resetMosaicState("editor_main");
        },
      },
      {
        label: "ダッシュボードの配置を初期化する",
        click(item: any, focusedWindow: any, event: any) {
          resetMosaicState("dashboard");
        },
      },
      { type: "separator" },
      {
        label: "setWindowSplit",
        click(item: any, focusedWindow: any, event: any) {
          setWindowSplit();
        },
      },
      { type: "separator" },
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            // { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
  {
    label: "ヘルプ",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          urlOpen("https://adenohitu.github.io/Hisui-docs/");
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
function setmenu() {
  Menu.setApplicationMenu(menu);
}
export default setmenu;
