import axios from "axios";
import { BrowserWindow } from "electron";
import { taskViewWindowApi } from "../browser/taskviewwindow";
import { win } from "../main";
import { logger } from "../tool/logger/logger";
import { servicestatus } from "./status";
const { app, dialog } = require("electron");
const version = app.getVersion();
const statusUrl = `https://hisui-api.herokuapp.com/servicestatus/api/?version=${version}`;
let timer: any = undefined;
let missCount = 0;
export async function startCheckServiceStatus() {
  runServiceStatus();
  timer = setInterval(runServiceStatus, 3600000);
}
export async function stopCheckServiceStatus() {
  clearInterval(timer);
}
function checkFocus() {
  if (BrowserWindow.getFocusedWindow()) {
    return true;
  } else {
    return false;
  }
}

export async function runServiceStatus() {
  try {
    const data = await axios.get(statusUrl, { timeout: 30000 });

    const statusData: servicestatus = data.data;
    logger.info(
      `StatusAPIReturn:${JSON.stringify(statusData)}`,
      "ServiceStatusManagiment"
    );

    if (statusData.useapp === false) {
      if (process.platform !== "win32") {
        win?.close();
        taskViewWindowApi.close();
      }
      if (statusData.statusMessage !== null) {
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
      } else {
        const selectStatus = await dialog.showMessageBox({
          type: "error",
          title: "このアプリは現在使用できません",
          message: "discordコミュニティを確認してください",
          detail: "discordコミュニティを確認してください",
          buttons: ["アプリを終了する"],
        });
        if (selectStatus.response === 0) {
          app.quit();
        }
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
  } catch (error) {
    if (missCount <= 2) {
      missCount++;
      runServiceStatus();
    } else {
      missCount = 0;
      if (checkFocus()) {
        const selectStatus = await dialog.showMessageBox({
          type: "error",
          title: "認証サーバーにアクセスできません",
          message: "認証サーバーにアクセスできません",
          detail:
            "このアプリケーションに問題があるか、インターネット接続に問題がある可能性があります。インターネット状況を確認して改善しない場合は、Discordコミュニティで質問してください",
          buttons: ["アプリを終了する", "そのまま使用する"],
          cancelId: -1, // Esc で閉じられたときの戻り値
        });

        if (selectStatus.response === 0) {
          app.quit();
        }
      } else {
        // 次回フォーカスが入った時に再実行する
        app.once("browser-window-focus", () => {
          runServiceStatus();
        });
      }
    }
  }
}
