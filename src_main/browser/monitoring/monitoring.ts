import { app } from "electron";
import { urlOpen } from "../../tool/openExternal";
const urlList = ["https://atcoder.jp", "http://localhost:3000"];
export const monitoringWebContents = () => {
  // AtCoder以外のドメインへのナビケーションを無効化
  // 例外としてimg.atcoderなどに飛ばされる場合はurlopenする
  app.on("web-contents-created", (event, contents) => {
    contents.on("will-navigate", (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      if (!(parsedUrl.origin in urlList)) {
        event.preventDefault();
        urlOpen(navigationUrl);
      }
    });
  });

  app.on("web-contents-created", (event, contents) => {
    contents.setWindowOpenHandler(({ url }) => {
      // この例では、既定のブラウザでこのイベントのURLを開くように
      // オペレーティングシステムに依頼します。
      //
      // shell.openExternal に渡す URL を許可する基準ついては、
      // 以降の項目を参照してください。

      urlOpen(url);

      return { action: "deny" };
    });
  });
};
