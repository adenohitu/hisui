import { IpcEventsKey } from "../src_main/ipc/events";

class IpcRendererManager {
  public send(channel: IpcEventsKey, ...args: Array<any>) {
    window.ipc[channel](...args);
  }
  public invoke(channel: IpcEventsKey, ...args: Array<any>): Promise<any> {
    return window.ipc[channel](...args);
  }
}
export const ipcRendererManager = new IpcRendererManager();
