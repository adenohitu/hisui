import { app } from "electron";
import { contestDataApi } from "../../data/contestdata";
import { taskControlApi } from "../../editor/control";
import { notificationManagerApi } from "../../tool/notification";
import { urlOpen } from "../../tool/openExternal";
import {
  createTaskcontFromOriginalURL,
  getcontestIDFromOriginalURL,
  returnCreateTaskcontFromURL,
} from "../../tool/taskurl-parser";
/**
 * 許可なくアクセス可能なURLのListを取得
 */
export function getUrlList() {
  if (app.isPackaged) {
    return ["https://atcoder.jp", "https://kenkoooo.com"];
  } else {
    return [
      "https://atcoder.jp",
      "http://localhost:3000",
      "https://kenkoooo.com",
    ];
  }
}
export const monitoringWebContents = () => {
  // AtCoder以外のドメインへのナビケーションを無効化
  // 例外としてimg.atcoderなどに飛ばされる場合はurlopenする
  app.on("web-contents-created", (event, contents) => {
    contents.on("will-navigate", (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      if (!getUrlList().includes(parsedUrl.origin)) {
        event.preventDefault();
        urlOpen(navigationUrl);
      } else {
        // もしURLがコンテストメインページなら変更するか通知を出す
        checkURLEvent(navigationUrl);
        const checkURLResult = createTaskcontFromOriginalURL(navigationUrl);
        if (checkURLResult) {
          event.preventDefault();
        }
      }
    });
  });
  // 新規Windowの作成を無効化
  app.on("web-contents-created", (event, contents) => {
    contents.setWindowOpenHandler(({ url }) => {
      const check = checkURLEvent(url);
      if (check === null) {
        urlOpen(url);
      }
      return { action: "deny" };
    });
  });
};
/**
 * URLに反応すべきデータがなければFalse
 * あればFalseを返す
 * またデータに関するイベントも実行する
 */
function checkURLEvent(url: string): {
  checkContestID: {
    contestID: string;
    isContestMainPage: boolean;
  } | null;
  checkURLResult: returnCreateTaskcontFromURL | null;
} | null {
  const checkContestID = getcontestIDFromOriginalURL(url);
  const checkURLResult = createTaskcontFromOriginalURL(url);

  // もしURLが問題ページの場合TaskContを作成する

  if (checkURLResult) {
    (async () => {
      taskControlApi.createNewTask(
        checkURLResult.contestName,
        checkURLResult.taskScreenName
      );
    })();
  }

  if (
    checkContestID &&
    contestDataApi.getDefaultContestID() !== checkContestID.contestID
  ) {
    if (checkContestID.isContestMainPage === true) {
      notificationManagerApi.runInteractiveNotification(
        {
          id: "setDefaultContestIDFromURLEvent",
          message: `デフォルトのコンテストを${checkContestID.contestID}に変更しますか？`,
          choices: [{ text: "変更する" }],
        },
        (indexnum) => {
          if (indexnum === 0) {
            contestDataApi.setDefaultContestID(checkContestID.contestID);
          }
        }
      );
    }
  }
  if (checkContestID || checkURLResult) {
    return { checkContestID, checkURLResult };
  } else {
    return null;
  }
}
