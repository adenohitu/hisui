import { contextBridge, ipcRenderer } from "electron";
//分離されたプリロードスクリプト

/**
 * TaskViewwindowのLoadとMainのContext
 */
contextBridge.exposeInMainWorld("api", {
  opencontext: () => {
    ipcRenderer.send("OPEN_CONTEXT_MENU");
  },
});
window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  ipcRenderer.send("OPEN_CONTEXT_MENU");
});
