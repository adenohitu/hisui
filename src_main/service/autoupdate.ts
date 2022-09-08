import { app, dialog } from "electron";
import { autoUpdater } from "electron-updater";
import { ipcMainManager } from "../ipc/ipc";
import { win } from "../main";
import { logger } from "../tool/logger/logger";
export function setupAutoUpdater() {
  app.on("ready", function () {
    autoUpdater.checkForUpdates();
  });
  autoUpdater.on("checking-for-update", () => {
    logger.info("Checking for update...", "autoUpdater");
    // sendStatusToWindow('Checking for update...');
  });
  autoUpdater.on("update-available", (info) => {
    logger.info(JSON.stringify(info, null, 2), "autoUpdater");
    ipcMainManager.send(
      "SEND_NOTIFICARION",
      "現在新しいバージョンをダウンロードしています。"
    );
  });
  autoUpdater.on("update-not-available", (info) => {
    logger.info("Update not available.", "autoUpdater");
  });
  autoUpdater.on("error", (err) => {
    ipcMainManager.send("SEND_NOTIFICARION", "Error in auto-updater. " + err);
  });
  autoUpdater.on("download-progress", (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + " - Downloaded " + progressObj.percent + "%";
    log_message =
      log_message +
      " (" +
      progressObj.transferred +
      "/" +
      progressObj.total +
      ")";
    console.log(log_message);
    logger.info(log_message, "autoUpdater");
  });
  autoUpdater.on("update-downloaded", (info) => {
    const dialogOpts = {
      type: "info",
      buttons: ["更新して再起動", "あとで"],
      message: "アップデート",
      detail:
        "新しいバージョンをダウンロードしました。再起動して更新を適用しますか？",
    };

    // ダイアログを表示しすぐに再起動するか確認
    if (win) {
      dialog.showMessageBox(win, dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    }
  });
}
