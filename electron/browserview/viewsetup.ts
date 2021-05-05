import { BrowserView, BrowserWindow } from "electron";
import { store } from "../save/save";
import * as isDev from "electron-is-dev";

const menuSize = 55;
export function setupWindowView(win: BrowserWindow) {
  let view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: __dirname + "/../preload.js",
    },
  });
  console.log(__dirname + "/../preload.js");

  win.addBrowserView(view);
  const newBounds = win?.getContentBounds();

  view.setBounds({
    x: menuSize,
    y: 0,
    width: newBounds.width - menuSize,
    height: newBounds.height,
  });
  view.setAutoResize({ width: false, height: false });
  if (isDev) {
    view.webContents.loadURL("http://localhost:3000#/");
  } else {
    // 'build/index.html'
    view.webContents.loadURL(`file://${__dirname}/../../index.html#/`);
  }
  // view.webContents.openDevTools({ mode: "detach" });

  win.on("resize", function () {
    // store window's new size in variable
    const newBounds = win?.getContentBounds();

    // set BrowserView's bounds explicitly
    if (newBounds) {
      view.setBounds({
        x: menuSize,
        y: 0,
        width: newBounds.width - menuSize,
        height: newBounds.height,
      });
    }
  });
}
