import { ipcMain } from "electron";

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
  ) {
    ipcMain.on(channel, listener);
  }
}

export const ipcMainManager = new IpcMainManager();
