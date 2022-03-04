import { readdir } from "fs/promises";
import path from "path";
import { taskViewWindowApi } from "../browser/taskviewwindow";
import { Atcoder } from "../data/atcoder";
import { hisuiEvent } from "../event/event";
interface plugin {
  setupView: (userID: string) => {
    url: string;
  };
}
export const pluginloader = async () => {
  const pluginPath = await readdir(path.join(__dirname, "../../plugins"));
  pluginPath.forEach(async (pluginFileName: string) => {
    const { setupView }: plugin = await import(
      path.join(__dirname, "../../plugins", pluginFileName, "index.js")
    );
    const listner = () => {
      const userID = Atcoder.getUsername();
      const urlInfo = setupView(userID || "");
      taskViewWindowApi.addView(
        "atcoder-ploblem",
        urlInfo.url,
        __dirname + "../browser/preload/web-preload.js"
      );
    };
    hisuiEvent.on("setup-addView", listner);
    // ログイン後USETIDを指定するためViewを再ロード
    hisuiEvent.on("login", async () => {
      await taskViewWindowApi.removeView("atcoder-ploblem");
      listner();
    });
  });
};
/**
 * ファイル改ざんをチェック
 */
// export const thirdPartyPluginLoad = async () => {
//   const test = await readFile(
//     path.join(
//       app.getPath("userData"),
//       "setting",
//       "plugin",
//       "hisui-atcoderploblem.asar",
//       "test.svg"
//     ),
//     "utf-8"
//   );
//   console.log(test);

//   const { hello }: plugin = await import(
//     path.join(
//       app.getPath("userData"),
//       "setting",
//       "plugin",
//       "hisui-atcoderploblem.asar",
//       "index.js"
//     )
//   );
//   hello("World");
// };
