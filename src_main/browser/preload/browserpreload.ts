const { contextBridge, ipcRenderer } = require("electron");
//分離されたプリロードスクリプト

/**
 * TaskViewwindowのLoadとMainのContext
 */
contextBridge.exposeInMainWorld("taskview", {
  nowTaskViewReset: () => {
    ipcRenderer.send("nowTaskViewReset");
  },
});
