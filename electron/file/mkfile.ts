//フォルダ操作に関する関数
//Copyright © 2021 adenohitu. All rights reserved.
//ファイル操作に関するモジュール
import { app, dialog } from "electron";
import { store } from "../save/save";
import {
  mkdir,
  readdirSync,
  writeFileSync,
  statSync,
  readFileSync,
  readFile,
  writeFile,
} from "fs";
import { languageselect, languagetype } from "./extension";
/**
 * 非同期でファイルを読み込みPromiseを返す
 * ファイルのフルパスを入力
 */
export const readFileAwait = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    readFile(filePath, "utf-8", (err, data) => {
      resolve(data);
    });
  });
};
/**
 * 非同期でファイルに書き込みPromiseを返す
 * ファイルのフルパスを入力
 */
export const writeFileAwait = (
  filePath: string,
  data: string
): Promise<"succsess" | undefined> => {
  return new Promise((resolve, reject) => {
    writeFile(filePath, data, (err) => {
      if (err) throw err;
      console.log(filePath);
      resolve("succsess");
    });
  });
};
/**
 * デフォルトのフォルダーを決めるダイアログを開く
 * ダイアログを飛ばしている #60
 */
export const runMakeDefaultFolderDialog = async (win: any) => {
  // const filename: any = await dialog.showOpenDialog(win, {
  //   properties: ["openDirectory"],
  //   title: "コードを保存するフォルダーを選択してください",
  //   defaultPath: app.getPath("documents"),
  // });
  const defaultPath = app.getPath("documents");
  runMakeDefaultFolder(defaultPath);
};

/**
 * デフォルトの保存フォルダを作成する
 * app.getPath("documents")
 * デフォルトのファイル名は"hisui"
 */
export const runMakeDefaultFolder = (
  mainpath: string,
  filename: string = "hisui-alpha"
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
 * 存在チェックをしファイルがなければ作成
 * ファイルのフルパスを返す
 * folderdirにファイル名またさらに下の階層のフォルダーがいい場合は記入
 * 例:makeFile("a.py","abc001/a")
 */
export const runMakeFile = async (
  foldername: string,
  folderdir: string = ""
): Promise<string> => {
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
    console.log("ファイルは存在します");
    return savefolderpath;
  } else {
    await writeFileAwait(savefolderpath, "");
    return savefolderpath;
  }
};
/**
 * ファイル読み込みを行う
 * ファイルが作成されていない場合は作成される
 */
export const getFiledata = async (
  contestname: string,
  AssignmentName: string,
  lang: languagetype
) => {
  const filename = await runMakeFile(
    `${AssignmentName}${languageselect[lang]}`,
    contestname
  );
  const filedata = await readFileSync(filename, "utf8");
  return filedata;
};
/**
 * ファイルに書き込みをする
 * ファイルが存在しない場合作成する
 */
export const runWritefile = async (
  data: string,
  contestname: string,
  TaskScreenName: string,
  lang: languagetype
) => {
  const filename = await runMakeFile(
    `${TaskScreenName}${languageselect[lang]}`,
    contestname
  );
  try {
    await writeFileSync(filename, data, "utf8");
    return true;
  } catch (err) {
    return false;
  }
};
