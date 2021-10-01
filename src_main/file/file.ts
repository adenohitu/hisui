import { app } from "electron";
import { mkdir } from "fs";
import { store } from "../save/save";
/**
 * 保存フォルダの設定
 * 起動時に呼び出す
 */
export const setupDefaultFolder = () => {
  if (store.has("saveDefaultFolder")) {
    //   既に設定されている
    const savedir = store.get("saveDefaultFolder");
    console.log(`saveDir:${savedir}`);
  } else {
    //   設定されていない場合ファイルの存在をチェックした後Storeにディレクトリーを保存
    const savepath = `${app.getPath("userData")}/${"UserData"}`;
    mkdir(savepath, (err: any) => {
      if (err) {
        console.log("すでに保存フォルダが存在します");
        console.log(savepath);
        console.log(`saveDir:${savepath}`);

        store.set("saveDefaultFolder", savepath);
      } else {
        console.log("デフォルトの保存フォルダが作成されました");
        console.log(savepath);
        console.log(`saveDir:${savepath}`);

        store.set("saveDefaultFolder", savepath);
      }
    });
  }
};
/**
 * デフォルトの保存フォルダーのディレクトリーを取得
 */
export const getDefaultder = () => {
  return store.get("saveDefaultFolder");
};
