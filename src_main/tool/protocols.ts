import { app, dialog } from "electron";
import path from "path";
import { appMain } from "../main";

export const setupProtocols = () => {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient("hisui-service", process.execPath, [
        path.resolve(process.argv[1]),
      ]);
    }
  } else {
    app.setAsDefaultProtocolClient("hisui-service");
  }
  // プロトコルのハンドリング。 今回は、エラーボックスを表示することにします。
  app.on("open-url", (event, url) => {
    if (appMain.win)
      dialog.showMessageBox(appMain.win, {
        message: url,
      });
  });
};
