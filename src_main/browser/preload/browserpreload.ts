import { contextBridge, ipcRenderer } from "electron";
//分離されたプリロードスクリプト

/**
 * TaskViewwindowのLoadとMainのContext
 */
contextBridge.exposeInMainWorld("taskview", {
  nowTaskViewReset: () => {
    ipcRenderer.send("nowTaskViewReset");
  },
  nowTaskViewReload: () => {
    ipcRenderer.send("nowTaskViewReload");
  },
});
