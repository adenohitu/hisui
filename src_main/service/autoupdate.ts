import { app } from "electron";
import { autoUpdater } from "electron-updater";
import { ipcMainManager } from "../ipc/ipc";
import { logger } from "../tool/logger/logger";
export function setupAutoUpdater() {
  app.on("ready", function () {
    autoUpdater.checkForUpdatesAndNotify();
  });
  autoUpdater.on("checking-for-update", () => {
    logger.info("Checking for update...", "autoUpdater");
    // sendStatusToWindow('Checking for update...');
  });
  autoUpdater.on("update-available", (info) => {
    logger.info("Update available.", "autoUpdater");
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
    ipcMainManager.send("SEND_NOTIFICARION", "Update downloaded");
  });
}
