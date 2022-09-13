import { app, dialog, Menu, MenuItemConstructorOptions } from "electron";
import { setBrowserCoockie } from "../save/utility/session";
import { Atcoder } from "../data/atcoder";
import { taskControlApi } from "../editor/control";
import { urlOpen } from "../tool/openExternal";
import { setWindowSplit } from "../browser/tool/monitorsize";
import { ipcMainManager } from "../ipc/ipc";
import { resetMosaicState } from "../save/utility/mosaic-state";
import { submissionsApi } from "../data/submissions";
import { taskViewWindowApi } from "../browser/taskviewwindow";
import { win } from "../main";
import { TaskListApi } from "../data/task";
import path from "path";
import { notificationManagerApi } from "../tool/notification";
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
function getDevelopMenu(
  developarg: boolean
): Array<MenuItemConstructorOptions> {
  if (!packd || developarg) {
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
            label: "open lib-management",
            click(item: any, focusedWindow: any, event: any) {
              taskViewWindowApi.changeViewTop("lib-management");
            },
          },
          {
            label: "open lib-management devtool",
            click(item: any, focusedWindow: any, event: any) {
              taskViewWindowApi.view[
                "lib-management"
              ].view.webContents.openDevTools();
            },
          },
          {
            label: "open ViewTop devtool",
            click(item: any, focusedWindow: any, event: any) {
              taskViewWindowApi.openTopDevTool();
            },
          },
          {
            label: "open ploblems",
            click(item: any, focusedWindow: any, event: any) {
              taskViewWindowApi.changeViewTop("atcoder-ploblem");
            },
          },
          {
            label: "reset taskList cache",
            click(item: any, focusedWindow: any, event: any) {
              TaskListApi.resetTaskListCache();
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
            label: "通知テスト",
            click(item: any, focusedWindow: any, event: any) {
              notificationManagerApi.runInteractiveNotification(
                {
                  id: "test",
                  message: `通知テスト。\n改行テスト`,
                  choices: [
                    { text: "OK", color: "primary" },
                    { text: "キャンセル", color: "error" },
                  ],
                },
                (choiceIndex: number) => {
                  if (choiceIndex === -1) {
                    console.log("閉じられました");
                  } else if (choiceIndex === 0) {
                    console.log("OKが押された");
                  } else {
                    console.log("キャンセルが押された");
                  }
                }
              );
            },
          },
          {
            label: "DevToolsOnMainwindow",
            click(item: any, focusedWindow: any, event: any) {
              win?.webContents.openDevTools({ mode: "detach" });
            },
          },
          {
            label: "DevToolsOnTaskView",
            click(item: any, focusedWindow: any, event: any) {
              taskViewWindowApi.win?.webContents.openDevTools({
                mode: "detach",
              });
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
            ipcMainManager.send("LISTENER_OPEN_LOGIN_DIALOG");
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
            ipcMainManager.send("LISTENER_OPEN_DEFAULT_DIALOG");
          },
        },
        { type: "separator" },
        {
          label: "提出一覧を更新",
          click(item: any, focusedWindow: any, event: any) {
            submissionsApi.updateSubmissions();
          },
        },
        {
          label: "提出する",
          click(item: any, focusedWindow: any, event: any) {
            taskControlApi.submitNowTop();
          },
          accelerator: "CommandOrControl+Shift+S",
        },
      ],
    },
  ];
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        {
          label: "設定のリセット",
          click: async () => {
            const options: Electron.MessageBoxSyncOptions = {
              type: "question",
              title: "設定の初期化",
              message: "設定を全て初期状態に戻します",
              detail:
                "設定をリセットします。この操作は元に戻すことができません。（アプリは再起動されます。）",
              buttons: ["OK", "Cancel"],
              cancelId: -1, // Esc で閉じられたときの戻り値
            };

            dialog.showMessageBox(options).then(async (buttonid) => {
              if (buttonid.response === 0) {
                const fsx = await import("fs-extra");
                const appName = "hisui";

                const getAppPath = path.join(app.getPath("appData"), appName);
                console.log(getAppPath);

                fsx.remove(getAppPath, () => {
                  app.relaunch();
                  app.exit();
                });
              }
            });
          },
        },
      ],
    },
  ];
}
export function setMenu(develop: boolean = false) {
  const menu: Array<MenuItemConstructorOptions> = [
    ...getMacmenu(),
    ...getFileMenu(),
    ...getDevelopMenu(develop),
    ...getEditMenu(),
    ...getHisuiControlMenu(),
    // ...getViewMenu(),
    ...getWindowMenu(),
    ...getHelpMenu(),
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}
