import { autoUpdater } from "electron-updater";
import { dialog } from "electron";
export function updateSetup() {
  const log = require("electron-log");
  log.transports.file.level = "info";
  autoUpdater.logger = log;
  // アップデートをチェック
  //-------------------------------------------
  // 自動アップデート関連のイベント処理
  //-------------------------------------------
  // アップデートをチェック開始
  autoUpdater.on("checking-for-update", () => {
    log.info(process.pid, "checking-for-update...");
  });
  // アップデートが見つかった
  autoUpdater.on("update-available", (ev, info) => {
    log.info(process.pid, "Update available.");
  });
  // アップデートがなかった（最新版だった）
  autoUpdater.on("update-not-available", (ev, info) => {
    log.info(process.pid, "Update not available.");
  });
  // アップデートのダウンロードが完了
  autoUpdater.on("update-downloaded", (info) => {
    const dialogOpts = {
      type: "info",
      buttons: ["更新して再起動", "あとで"],
      message: "アップデート",
      detail:
        "新しいバージョンをダウンロードしました。再起動して更新を適用しますか？",
    };

    // ダイアログを表示しすぐに再起動するか確認
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
  // エラーが発生
  autoUpdater.on("error", (err) => {
    log.error(process.pid, err);
  });
}
export function updateChack() {
  autoUpdater.checkForUpdatesAndNotify();
}
