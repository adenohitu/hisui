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

    const userID = Atcoder.getUsername();
    const urlInfo = setupView(userID || "");

    hisuiEvent.on("setup-addView", () => {
      taskViewWindowApi.addView(
        "atcoder-ploblem",
        urlInfo.url,
        __dirname + "../browser/preload/web-preload.js"
      );
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
