import { ipcRenderer } from "electron";
//分離されたプリロードスクリプト

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  ipcRenderer.send("OPEN_CONTEXT_MENU");
});
