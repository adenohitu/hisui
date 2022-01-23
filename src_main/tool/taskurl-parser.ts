import { contestName, taskScreenName } from "../interfaces";

export interface returnCreateTaskcontFromURL {
  contestName: contestName;
  taskScreenName: taskScreenName;
}
/**
 * https://atcoder.jp/contests/abc221/tasks/abc221_a/
 * のようなURLから
 * ContestNameとTaskscreenNameを取得する
 */
export function createTaskcontFromOriginalURL(
  url: string
): null | returnCreateTaskcontFromURL {
  const urlclass = new URL(url);
  if (urlclass.hostname === "atcoder.jp" && url.includes("editorial")) {
    return null;
  } else if (urlclass.hostname === "atcoder.jp" && url.includes("tasks/")) {
    const pathName = urlclass.pathname;
    const name = pathName.slice(
      pathName.indexOf("contests/") + 9,
      pathName.indexOf("/tasks")
    );
    // TaskScreenNameの前側を切り取る
    const taskscNameStartCut = pathName.slice(pathName.indexOf("tasks/") + 6);
    // 後ろに"/editorial"などがついている時外す
    const taskscNamerResult =
      (taskscNameStartCut.includes("/") &&
        taskscNameStartCut.slice(undefined, taskscNameStartCut.indexOf("/"))) ||
      taskscNameStartCut;

    return {
      contestName: name,
      taskScreenName: taskscNamerResult,
    };
  } else {
    return null;
  }
}
/**
 * /contests/abc200/tasks/abc200_a
 * のような形式から作成
 */
export function createTaskcontFromOriginalURL_NoOrigin(urlNoOrigin: string) {
  const pathName = urlNoOrigin;
  const name = pathName.slice(
    pathName.indexOf("contests/") + 9,
    pathName.indexOf("/tasks")
  );
  // TaskScreenNameの前側を切り取る
  const taskscNameStartCut = pathName.slice(pathName.indexOf("tasks/") + 6);
  // 後ろに"/editorial"などがついている時外す
  const taskscNamerResult =
    (taskscNameStartCut.includes("/") &&
      taskscNameStartCut.slice(undefined, taskscNameStartCut.indexOf("/"))) ||
    taskscNameStartCut;

  return {
    contestName: name,
    taskScreenName: taskscNamerResult,
  };
}
