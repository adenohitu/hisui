import { view } from "./view";

const test = {
  dev: "http://localhost:3000#/",
  product: `file://${__dirname}/../../index.html#/`,
};
class mainPage extends view {
  /**
   * ログインダイアログを出す
   */
  openLoginDialog() {
    this.runWindowTop();
    this.send("LISTENER_OPEN_LOGIN_DIALOG");
  }
  /**
   * デフォルトコンテストを設定するダイアログを出す
   */
  openDafaultContestDialog() {
    this.runWindowTop();
    this.view?.webContents.send("dafaltContest");
  }
}

export const mainPageapi = new mainPage(test);
