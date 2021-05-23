import { app, Menu } from "electron";
import { setBrowserCoockie } from "../browser/session";
import { createsampleViewapi } from "../browserview/createsampleview";
import { dashboardapi } from "../browserview/dashboardview";
// import { editorViewapi } from "../browserview/editorview";
import { mainPageapi } from "../browserview/mainpageview";
import { settingDialogOpen } from "../browserview/mgt/dialog";
import { timerApi } from "../clock/timer";
import { Atcoder } from "../data/atcoder";
import { runMakeDefaultFolderDialog } from "../file/mkfile";
import urlOpen from "../tool/openExternal";
import openTaskAll from "../tool/open_taskAll";
const isMac = process.platform === "darwin";
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
        label: "保存フォルダーを設定",
        click(item: any, focusedWindow: any, event: any) {
          runMakeDefaultFolderDialog(focusedWindow);
        },
      },
      isMac ? { role: "close" } : { role: "quit" },
    ],
  },
  // { role: 'editMenu' }
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
          focusedWindow.webContents.send("loginOpen");
        },
      },
      {
        label: "セッション同期",
        click(item: any, focusedWindow: any, event: any) {
          setBrowserCoockie();
        },
      },
      {
        label: "logout",
        click(item: any, focusedWindow: any, event: any) {
          Atcoder.runLogout();
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
          // focusedWindow.webContents.send("dafaltContest");
          settingDialogOpen();
        },
      },
      { type: "separator" },
      {
        label: "Open all tasks",
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
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: "ウィンドウ",
    submenu: [
      {
        label: "stoptimer",
        click(item: any, focusedWindow: any, event: any) {
          timerApi.clearTimer();
        },
      },
      {
        label: "配置を初期化する",
        click(item: any, focusedWindow: any, event: any) {
          dashboardapi.resetWindowState();
        },
      },
      {
        label: "logtest",
        click(item: any, focusedWindow: any, event: any) {
          console.log(focusedWindow.getBrowserViews());
        },
      },
      {
        label: "mainPageTop",
        click(item: any, focusedWindow: any, event: any) {
          mainPageapi.runWindowTop();
        },
      },
      {
        label: "dashboardTop",
        click(item: any, focusedWindow: any, event: any) {
          dashboardapi.runWindowTop();
        },
      },
      {
        label: "dashboardRankDataUpdate",
        click(item: any, focusedWindow: any, event: any) {
          dashboardapi.runUpdateRankdata();
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
            { role: "window" },
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
          urlOpen("https://github.com/adenohitu/Hisui-docs");
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
