import { app } from "electron";
import path from "path";
import fse from "fs-extra";
/**
 * 保存フォルダの設定
 * 起動時に呼び出す
 */
export const setupDefaultFolder = () => {
  fse
    .ensureDir(path.join(app.getPath("userData"), "UserData"))
    .then(() => {
      console.log("success!");
    })
    .catch((err) => {
      console.error(err);
    });
};
/**
 * デフォルトの保存フォルダーのディレクトリーを取得
 */
export const getDefaultdir = () => {
  return path.join(app.getPath("userData"), "UserData");
};
