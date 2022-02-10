/**
 * コードデータの読み込みと書き込み
 */
import { lstat, mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { languages, languagetype } from "./extension";
import { getDefaultdir } from "./file";

export interface readDileDataProps {
  contestName: string;
  taskScreenName: string;
  language: string;
}
/**
 * 保存されたデータを取得する
 */
export async function readFileData(
  contestName: string,
  taskScreenName: string,
  language: languagetype
): Promise<{
  saveDir: string;
  data: string;
}> {
  const defalutdir = getDefaultdir();
  const contestDir = path.join(defalutdir, "codeData", contestName);
  await mkdir(contestDir, { recursive: true }).catch(() => {
    console.log("既に保存ファイルがあります");
  });

  // ex:abc200_a.cpp
  const fileName = taskScreenName + languages[language].extension;
  const loadFileDir = path.join(defalutdir, "codeData", contestName, fileName);
  const fileStatus = await fileExists(loadFileDir);
  if (fileStatus) {
    const data = await readFile(loadFileDir, "utf-8");
    return { saveDir: loadFileDir, data: data };
  } else {
    return { saveDir: loadFileDir, data: "" };
  }
}
/**
 * データをファイルに保存する
 * readTaskDataがこれ以前に実行されていないと、
 */
export async function writeFileData(
  data: string,
  contestName: string,
  taskScreenName: string,
  language: languagetype
) {
  const defalutdir = getDefaultdir();
  // contestDirを作成
  const contestDir = path.join(defalutdir, "codeData", contestName);
  await mkdir(contestDir, { recursive: true }).catch(() => {
    console.log("既に保存ファイルがあります");
  });
  // ファイルに書き込み
  const fileName = taskScreenName + languages[language].extension;
  const loadFileDir = path.join(defalutdir, "codeData", contestName, fileName);
  console.log(`Write:${loadFileDir}`);
  return writeFile(loadFileDir, data, "utf-8");
}
/**
 * ファイルの存在を調べる
 */
async function fileExists(filepath: string) {
  try {
    return !!(await lstat(filepath));
  } catch (e) {
    return false;
  }
}
