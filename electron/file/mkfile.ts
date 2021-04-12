//フォルダ操作に関する関数
//Copyright © 2021 adenohitu. All rights reserved.
// import { app } from "electron";
import { store } from "../save/save";
import { mkdir, readdirSync, writeFileSync, statSync } from "fs";
/**
 * デフォルトの保存フォルダを作成する
 * app.getPath("documents")
 * デフォルトのファイル名は"hisui"
 */
export const makeDefaultFolder = (
  mainpath: string,
  filename: string = "hisui"
) => {
  const savepath = `${mainpath}/${filename}`;
  mkdir(savepath, (err: any) => {
    if (err) {
      console.log("すでにフォルダが存在します");
    } else {
      console.log("デフォルトの保存フォルダが作成されました");
      console.log(savepath);
      store.set("saveDefaultFolder", savepath);
    }
  });
};
/**
 * デフォルトフォルダに保存されたファイルの一覧を返す
 */
export const getDefaultfiledata = async () => {
  const saveDefaultFolder = await store.get("saveDefaultFolder");
  const filelist = readdirSync(saveDefaultFolder);
  return filelist;
};
/**
 * 新規ファイルを作成
 * folderdirにファイル名またさらに下の階層のフォルダーがいい場合は記入
 * 例:makeFile("a.py","abc001/a")
 */
export const makeFile = async (foldername: string, folderdir: string = "") => {
  const saveDefaultFolder = await store.get("saveDefaultFolder");
  const mkfolderpath = `${saveDefaultFolder}/${folderdir}`;
  const savefolderpath = `${saveDefaultFolder}/${folderdir}/${foldername}`;
  //フォルダーを作成
  function isExistfolder(file: any) {
    try {
      statSync(file);
      return true;
    } catch (err) {
      if (err.code === "ENOENT") return false;
    }
  }

  if (isExistfolder(mkfolderpath)) {
    console.log("フォルダーは存在します");
  } else {
    await mkdir(mkfolderpath, { recursive: true }, (err: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log("フォルダーが作成されました");
        console.log(mkfolderpath);
      }
    });
  }

  function isExistFile(file: any) {
    try {
      statSync(file);
      return true;
    } catch (err) {
      if (err.code === "ENOENT") return false;
    }
  }
  const exfile = await isExistFile(savefolderpath);

  //ファイルを新規作成（上書き禁止）
  if (exfile) {
    console.log("すでに存在します");
  } else {
    await writeFileSync(savefolderpath, "", "utf8");
  }

  /**
   *
   */
};
