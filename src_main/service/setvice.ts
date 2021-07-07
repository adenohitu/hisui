import axios from "axios";
import { servicestatus } from "./status";
const { app, dialog } = require("electron");
const version = app.getVersion();
const statusUrl = `https://hisui-api.herokuapp.com/servicestatus/api/?version=${version}`;
let timer: any = undefined;

export async function startCheckServiceStatus() {
  runServiceStatus();
  timer = setInterval(runServiceStatus, 3600000);
}
export async function stopCheckServiceStatus() {
  clearInterval(timer);
}

export async function runServiceStatus() {
  const data: any = await axios.get(statusUrl, { timeout: 30000 });

  const statusData: servicestatus = data.data;
  console.log(statusData);

  if (statusData.useapp === false && statusData.statusMessage !== null) {
    const selectStatus = await dialog.showMessageBox({
      type: "error",
      title: statusData.statusMessage.title,
      message: statusData.statusMessage.title,
      detail: statusData.statusMessage.detail,
      buttons: ["アプリを終了する"],
    });

    if (selectStatus.response === 0) {
      app.quit();
    }
  }

  if (statusData.status === "warning" && statusData.statusMessage !== null) {
    const selectStatus = await dialog.showMessageBox({
      type: "warning",
      title: statusData.statusMessage.title,
      message: statusData.statusMessage.title,
      detail: statusData.statusMessage.detail,
      buttons: ["アプリを終了する", "そのまま使用する"],
      cancelId: -1, // Esc で閉じられたときの戻り値
    });

    if (selectStatus.response === 0) {
      app.quit();
    }
  }
}
