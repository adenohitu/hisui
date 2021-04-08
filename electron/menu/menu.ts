import { app, Menu } from "electron";
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
    submenu: [isMac ? { role: "close" } : { role: "quit" }],
  },
  // { role: 'editMenu' }
  {
    label: "Edit",
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
    label: "User",
    submenu: [
      { type: "separator" },
      {
        label: "login",
        click(item: any, focusedWindow: any, event: any) {
          focusedWindow.webContents.send("loginOpen");
        },
      },
    ],
  },
  {
    label: "Contest",
    submenu: [
      { type: "separator" },
      {
        label: "Select Contest",
        click(item: any, focusedWindow: any, event: any) {
          focusedWindow.webContents.send("dafaltContest");
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
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools", accelerator: "F12" },
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
    label: "Window",
    submenu: [
      {
        label: "配置を初期化する",
        click(item: any, focusedWindow: any, event: any) {
          focusedWindow.webContents.send("resetWindowState");
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
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://electronjs.org");
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
