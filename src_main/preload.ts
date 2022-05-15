import { type } from "os"; // eslint-disable-line
import { EventsArrey } from "./ipc/events";
import { contextBridge, ipcRenderer } from "electron";
//分離されたプリロードスクリプト
ipcRenderer.setMaxListeners(100);
const obj = EventsArrey.reduce((result: { [name: string]: any }, current) => {
  if (current[1].mode === "send") {
    result[current[0]] = (
      listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void,
      only?: boolean
    ) => {
      if (only === true) {
        ipcRenderer.removeAllListeners(current[0]);
      }
      ipcRenderer.on(current[0], listener);
      return () => {
        ipcRenderer.removeListener(current[0], listener);
      };
    };
    return result;
  } else if (current[1].mode === "handle") {
    result[current[0]] = async (...args: any[]) => {
      const data = await ipcRenderer.invoke(current[0], ...args);
      return data;
    };
    return result;
  } else if (current[1].mode === "on") {
    result[current[0]] = (...args: any[]) => {
      ipcRenderer.send(current[0], ...args);
    };
    return result;
  } else {
    return result;
  }
}, {});
contextBridge.exposeInMainWorld("ipc", obj);
