import { app, Menu, MenuItemConstructorOptions } from "electron";
import { setBrowserCoockie } from "../save/utility/session";
import { createsampleViewapi } from "../browserview/createsampleview";
import { dashboardapi } from "../browserview/dashboardview";
import { editorViewapi } from "../browserview/editorview";
import { mainPageapi } from "../browserview/mainpageview";
import { Atcoder } from "../data/atcoder";
import { taskControlApi } from "../editor/control";
import { urlOpen } from "../tool/openExternal";
import openTaskAll from "../tool/open_taskAll";
import { setWindowSplit } from "../browser/tool/monitorsize";
import { ipcMainManager } from "../ipc/ipc";
import { resetMosaicState } from "../save/utility/mosaic-state";
import { submissionsApi } from "../data/submissions";
import { taskViewWindowApi } from "../browser/taskviewwindow";
const isMac = process.platform === "darwin";
const packd = app.isPackaged;

function getMacmenu(): Array<MenuItemConstructorOptions> {
  if (isMac) {
    return [
      {
        label: app.name,
        submenu: [
          { role: "about", label: "Hisuiについて" },
          { type: "separator" },
          // { role: "services" },
          { type: "separator" },
          { role: "hide" },
          { role: "hideOthers" },
          { role: "unhide" },
          { type: "separator" },
          { role: "quit" },
        ],
      },
    ];
  } else {
    return [];
  }
}

function getFileMenu() {
  const FileMenu: Array<MenuItemConstructorOptions> = [
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
  ];
  return FileMenu;
}
function getDevelopMenu(): Array<MenuItemConstructorOptions> {
  if (!packd) {
    return [
      {
        label: "開発",
        submenu: [
          {
            label: "allcont remove",
            click(item: any, focusedWindow: any, event: any) {
              taskControlApi.removeAllTaskCont();
            },
          },
          {
            label: "oprn lib-management",
            click(item: any, focusedWindow: any, event: any) {
              taskViewWindowApi.changeViewTop("lib-management");
            },
          },
          {
            label: "oprn lib-management",
            click(item: any, focusedWindow: any, event: any) {
              taskViewWindowApi.view[
                "lib-management"
              ].view.webContents.openDevTools();
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
    ];
  } else {
    return [];
  }
}
function getEditMenu(): Array<MenuItemConstructorOptions> {
  if (isMac) {
    return [
      {
        label: "編集",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          { role: "pasteAndMatchStyle" },
          { role: "delete" },
          { role: "selectAll" },
          { type: "separator" },
          {
            label: "Speech",
            submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
          },
        ],
      },
    ];
  } else {
    return [
      {
        label: "編集",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          { role: "delete" },
          { type: "separator" },
          { role: "selectAll" },
        ],
      },
    ];
  }
}
function getHisuiControlMenu(): Array<MenuItemConstructorOptions> {
  return [
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
        {
          label: "提出一覧を更新",
          click(item: any, focusedWindow: any, event: any) {
            submissionsApi.updateSubmissions();
          },
        },
      ],
    },
  ];
}
function getViewMenu(): Array<MenuItemConstructorOptions> {
  return [
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
  ];
}
function getWindowMenu(): Array<MenuItemConstructorOptions> {
  if (isMac) {
    return [
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
          { type: "separator" },
          { role: "front" },
          { type: "separator" },
        ],
      },
    ];
  } else {
    return [
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
          { role: "close" },
        ],
      },
    ];
  }
}
function getHelpMenu(): Array<MenuItemConstructorOptions> {
  return [
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
}
export function setMenu() {
  const menu: Array<MenuItemConstructorOptions> = [
    ...getMacmenu(),
    ...getFileMenu(),
    ...getDevelopMenu(),
    ...getEditMenu(),
    ...getEditMenu(),
    ...getHisuiControlMenu(),
    ...getViewMenu(),
    ...getWindowMenu(),
    ...getHelpMenu(),
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}
