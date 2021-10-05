import { statSync } from "fs";
import { lstat, mkdir, readdir, readFile, writeFile } from "fs/promises";
import { SampleCase } from "../data/scraping/samplecase";
import { contestName, taskScreenName } from "../interfaces";
import { getDefaultder } from "./file";
/**
 * サンプルケースを保存する
 */
export const saveSanplecase = async (
  contestname: contestName,
  taskScreenName: taskScreenName,
  sampleName: string,
  input: string,
  answer: string | null = null
) => {
  const taskdir = await getTaskDir(contestname, taskScreenName);
  const inputpath = `${taskdir}/sample-${sampleName}.in`;
  const answerpath = `${taskdir}/sample-${sampleName}.out`;
  await writeFile(inputpath, input, "utf8");
  if (answer !== null) {
    await writeFile(answerpath, answer, "utf8");
  }
};
async function fileExists(filepath: string) {
  try {
    return !!(await lstat(filepath));
  } catch (e) {
    return false;
  }
}

/**
 * サンプルケースが保存済みかをチェックする
 * SampleNameもわかっている
 */
export const existSamplecaseKnowName = async (
  contestname: contestName,
  taskScreenName: taskScreenName,
  sampleName: string
) => {
  const taskdir = await getTaskDir(contestname, taskScreenName);
  const inputpath = `${taskdir}/sample-${sampleName}.in`;
  const inputExist = await fileExists(inputpath);
  if (inputExist) {
    return true;
  } else {
    return false;
  }
};
/**
 * サンプルケースを読み込む
 */
export const loadSamplecase: (
  contestname: contestName,
  taskScreenName: taskScreenName,
  sampleName: string
) => Promise<{
  input: string;
  answer?: string;
}> = async (contestname, taskScreenName, sampleName) => {
  const taskdir = await getTaskDir(contestname, taskScreenName);
  const inputpath = `${taskdir}/sample-${sampleName}.in`;
  const answerpath = `${taskdir}/sample-${sampleName}.out`;
  const input = await readFile(inputpath, "utf8");
  const answerExist = await fileExists(answerpath);
  if (answerExist) {
    const answer = await readFile(answerpath, "utf8");
    return {
      input,
      answer,
    };
  } else {
    return { input };
  }
};
function isExistfolder(file: any) {
  try {
    statSync(file);
    return true;
  } catch (err: any) {
    if (err.code === "ENOENT") return false;
  }
}
export const getTaskDir = async (
  contestname: contestName,
  taskScreenName: taskScreenName
) => {
  const defaultdir = getDefaultder();

  const taskdir = `${defaultdir}/${contestname}/${taskScreenName}`;
  if (isExistfolder(taskdir) !== true) {
    await mkdir(taskdir, { recursive: true });
  }

  return `${defaultdir}/${contestname}/${taskScreenName}`;
};
/**
 * サンプルケースが保存されているかをチェック
 */
export const existSamplecases = async (
  contestname: contestName,
  taskScreenName: taskScreenName
) => {
  const filelist = await readdir(await getTaskDir(contestname, taskScreenName));
  if (filelist.findIndex((e) => e.indexOf("sample") !== -1) !== -1) {
    return true;
  } else {
    return false;
  }
};
export const loadAllSamplecase: (
  contestname: contestName,
  taskScreenName: string
) => Promise<SampleCase[] | "not_saved"> = async (
  contestname: contestName,
  taskScreenName: taskScreenName
) => {
  // ファイルの存在、名前を取得
  const exist = await existSamplecases(contestname, taskScreenName);
  if (exist === true) {
    const filelist = await readdir(
      await getTaskDir(contestname, taskScreenName)
    );
    const inputFileNames = filelist.filter(
      (e) => e.includes("sample") && e.includes("in")
    );
    const answerFileNames = filelist.filter(
      (e) => e.includes("sample") && e.includes("out")
    );
    const fileNamePair = inputFileNames.map((ele) => {
      const inputName = ele.slice(ele.indexOf("-") + 1, ele.indexOf("."));
      const ans = answerFileNames.find((element) =>
        element.includes(`-${inputName}.`)
      );
      if (ans) {
        return { name: inputName, in: ele, ans: ans };
      } else {
        return { name: inputName, in: ele };
      }
    });
    // ファイルからサンプルを読み込む
    const taskdir = await getTaskDir(contestname, taskScreenName);
    const returnData = await Promise.all(
      fileNamePair.map(async (ele) => {
        const inputSanple = await readFile(`${taskdir}/${ele.in}`, "utf-8");
        if (ele.ans) {
          const answerSample = await readFile(`${taskdir}/${ele.ans}`, "utf-8");
          return { name: ele.name, case: inputSanple, answer: answerSample };
        } else {
          return { name: ele.name, case: inputSanple };
        }
      })
    );
    return returnData;
  } else {
    return "not_saved";
  }
};
