import { app } from "electron";
import path from "path";
import fse from "fs-extra";
import { logger } from "../tool/logger/logger";
/**
 * 保存フォルダの設定
 * 起動時に呼び出す
 */
export const setupDefaultFolder = () => {
  fse
    .ensureDir(path.join(app.getPath("userData"), "UserData"))
    .then(() => {
      logger.info("success!", "setupDefaultFolder");
    })
    .catch((err) => {
      logger.error(err, "setupDefaultFolder");
    });
};
/**
 * デフォルトの保存フォルダーのディレクトリーを取得
 */
export const getDefaultdir = () => {
  return path.join(app.getPath("userData"), "UserData");
};
