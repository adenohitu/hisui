/**
 * コードデータの読み込みと書き込み
 */
import { lstat, mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { logger } from "../tool/logger/logger";
import { languages } from "./extension";
import { getDefaultdir } from "./file";
import { taskCodeInfo, taskinfos } from "./taskinfo";

export interface readDileDataProps {
  contestName: string;
  taskScreenName: string;
  language: string;
}
/**
 * taskCodeInfoからデフォルトの保存場所を取得
 */
export function defaultCodeSaveFilepath(taskCodeInfoProps: taskCodeInfo) {
  const defalutdir = getDefaultdir();
  // ex:abc200_a.cpp
  const fileName =
    taskCodeInfoProps.taskID +
    languages[taskCodeInfoProps.editorInfo.languagetype].extension;
  const filePath = path.join(
    defalutdir,
    "mycode",
    taskCodeInfoProps.service,
    taskCodeInfoProps.taskGroup,
    fileName
  );
  return { filePath, fileName };
}

/**
 * 保存されたデータを取得する
 */
export async function readCodeFileData(taskPath: string): Promise<string> {
  const contestDir = path.resolve(taskPath, "../");
  await mkdir(contestDir, { recursive: true }).catch(() => {
    console.log("既に保存ファイルがあります");
  });

  const fileStatus = await fileExists(taskPath);
  if (fileStatus) {
    const data = await readFile(taskPath, "utf-8");
    return data;
  } else {
    return "";
  }
}

/**
 * データをファイルに保存する
 * また、TaskInfoにデータを書き込む
 */
export async function writeCodeFileData(
  filePath: string,
  fileName: string,
  data: string,
  taskCodeInfoProps: taskCodeInfo
) {
  const contestDir = path.resolve(filePath, "../");
  await mkdir(contestDir, { recursive: true }).catch(() => {
    console.log("既に保存ファイルがあります");
  });

  // ファイルに書き込み
  logger.info(`Write:${filePath}`, "editor-fs");
  await writeTaskinfo(filePath, fileName, taskCodeInfoProps);
  return await writeFile(filePath, data, "utf-8");
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

/**
 * 指定したコードファイルのTaskInfoの情報を取得
 */
export async function loadTaskinfo(filepathData: {
  filePath: string;
  fileName: string;
}): Promise<taskCodeInfo | null> {
  try {
    const codeInfoPath = path.resolve(
      filepathData.filePath,
      "../taskinfo.json"
    );
    const getinfo = await readFile(codeInfoPath, "utf-8");
    const jsonParse: taskinfos = JSON.parse(getinfo);
    return jsonParse[filepathData.fileName];
  } catch (error) {
    return null;
  }
}

/**
 * 指定したファイルの情報をTaskInfoファイルに書き込む
 */
export async function writeTaskinfo(
  CodeFilepath: string,
  filename: string,
  taskinfoIn: taskCodeInfo
): Promise<void> {
  try {
    const codeInfoPath = path.resolve(CodeFilepath, "../taskinfo.json");
    const istaskinfo = await fileExists(codeInfoPath);

    let taskinfos: taskinfos = {};

    if (istaskinfo) {
      const getinfo = await readFile(codeInfoPath, "utf-8");
      taskinfos = JSON.parse(getinfo);
    }

    // データ追記又は更新
    taskinfos[filename] = taskinfoIn;

    const datatojson = JSON.stringify(taskinfos, null, "\t");

    return writeFile(codeInfoPath, datatojson, "utf-8");
  } catch (error) {
    console.log(error);

    logger.error("TaskInfoを書き込めませんでした", "editor-fs");
  }
}
