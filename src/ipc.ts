import { IpcEventsKey } from "../src_main/ipc/events";

class IpcRendererManager {
  public send(channel: IpcEventsKey, ...args: Array<any>) {
    window.ipc[channel](...args);
  }
  public async invoke(
    channel: IpcEventsKey,
    ...args: Array<any>
  ): Promise<any> {
    return window.ipc[channel](...args);
  }
  public on(
    channel: IpcEventsKey,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ): () => void {
    return window.ipc[channel](listener);
  }
}
export const ipcRendererManager = new IpcRendererManager();
