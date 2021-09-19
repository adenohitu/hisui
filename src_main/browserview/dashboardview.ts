import { view } from "./view";
const url = {
  dev: "http://localhost:3000#/dashboard",
  product: `file://${__dirname}/../../index.html#/dashboard`,
};
class dashboard extends view {
  /**
   * dashboardのデータ全てをアップデートする
   */
  runUpdatedata() {
    this.send("UPDATE_DASHBOARD");
  }
  /**
   * windowの配置状態を初期化する
   */
  resetWindowState() {
    this.send("LISTENER_RESET_MOSAIC_WINDOW_STATE");
  }
}

export const dashboardapi = new dashboard(url);
