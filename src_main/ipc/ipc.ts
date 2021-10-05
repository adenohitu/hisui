import { ipcMain } from "electron";
import { dashboardapi } from "../browserview/dashboardview";
import { editorViewapi } from "../browserview/editorview";
import { mainPageapi } from "../browserview/mainpageview";
import { win } from "../main";

import { IpcEventsKey } from "./events";

class IpcMainManager {
  public handle(
    channel: IpcEventsKey,
    listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any
  ) {
    // there can be only one, so remove previous one first
    ipcMain.removeHandler(channel);
    ipcMain.handle(channel, listener);
  }

  public on(
    channel: IpcEventsKey,
    listener: (event: Electron.IpcMainEvent, ...args: any[]) => any
  ): () => void {
    ipcMain.on(channel, listener);
    return () => {
      ipcRenderer.removeListener(channel, listener);
    };
  }
  /**
   * win,mainPageapi,editorViewapi,dashboardapi
   * にsendする
   */
  public send(channel: IpcEventsKey, ...args: any[]) {
    win?.webContents.send(channel, ...args);
    mainPageapi.send(channel, ...args);
    editorViewapi.send(channel, ...args);
    dashboardapi.send(channel, ...args);
  }
}

export const ipcMainManager = new IpcMainManager();
