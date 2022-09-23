import { lstat, writeFile, mkdir, readFile } from "fs/promises";
import path from "path";
import { getDefaultdir } from "./file";

export const saveCacheAtCoderSubmissions = async (data: string) => {
  const defalutdir = getDefaultdir();
  const cacheFilrDir = path.join(defalutdir, "submissions-cache");
  // contestDirを作成
  await mkdir(cacheFilrDir, { recursive: true }).catch(() => {
    console.log("既に保存ファイルがあります");
  });
  // ファイルに書き込み
  const fileName = "cache-submissions-atcoder.json";
  const loadFileDir = path.join(cacheFilrDir, fileName);
  console.log(`Write:${loadFileDir}`);
  return writeFile(loadFileDir, data, "utf-8");
};

export const loadCacheAtCoderSubmissions = async () => {
  const defalutdir = getDefaultdir();
  const cacheFilrDir = path.join(defalutdir, "submissions-cache");
  const fileName = "cache-submissions-atcoder.json";
  const loadFileDir = path.join(cacheFilrDir, fileName);
  const fileStatus = await fileExists(loadFileDir);
  if (fileStatus) {
    const data = await readFile(loadFileDir, "utf-8");
    return { saveDir: loadFileDir, data: data };
  } else {
    return { saveDir: loadFileDir, data: "" };
  }
};

export const saveCachePloblemsSubmissions = async (data: string) => {
  const defalutdir = getDefaultdir();
  const cacheFilrDir = path.join(defalutdir, "submissions-cache");
  // contestDirを作成
  await mkdir(cacheFilrDir, { recursive: true }).catch(() => {
    console.log("既に保存ファイルがあります");
  });
  // ファイルに書き込み
  const fileName = "cache-submissions-ploblems.json";
  const loadFileDir = path.join(cacheFilrDir, fileName);
  console.log(`Write:${loadFileDir}`);
  return writeFile(loadFileDir, data, "utf-8");
};

export const loadCachePloblemsSubmissions = async () => {
  const defalutdir = getDefaultdir();
  const cacheFilrDir = path.join(defalutdir, "submissions-cache");
  const fileName = "cache-submissions-ploblems.json";
  const loadFileDir = path.join(cacheFilrDir, fileName);
  const fileStatus = await fileExists(loadFileDir);
  if (fileStatus) {
    const data = await readFile(loadFileDir, "utf-8");
    return { saveDir: loadFileDir, data: data };
  } else {
    return { saveDir: loadFileDir, data: "" };
  }
};

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
