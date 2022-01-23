import { app } from "electron";
import { taskControlApi } from "../../editor/control";
import { urlOpen } from "../../tool/openExternal";
import { createTaskcontFromOriginalURL } from "../../tool/taskurl-parser";
/**
 * 許可なくアクセス可能なURLのListを取得
 */
export function getUrlList() {
  if (app.isPackaged) {
    return ["https://atcoder.jp"];
  } else {
    return ["https://atcoder.jp", "http://localhost:3000"];
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
        // もしURLが問題ページの場合TaskContを作成する
        const checkURLResult = createTaskcontFromOriginalURL(navigationUrl);
        if (checkURLResult) {
          (async () => {
            taskControlApi.createNewTask(
              checkURLResult.contestName,
              checkURLResult.taskScreenName
            );
            event.preventDefault();
          })();
        }
      }
    });
  });
  // 新規Windowの作成を無効化
  app.on("web-contents-created", (event, contents) => {
    contents.setWindowOpenHandler(({ url }) => {
      // この例では、既定のブラウザでこのイベントのURLを開くように
      // オペレーティングシステムに依頼します。
      urlOpen(url);

      return { action: "deny" };
    });
  });
};
