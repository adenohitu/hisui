//コンテスト情報に関するモジュール
//Copyright © 2021-2022 adenohitu. All rights reserved.
import contest_main from "./scraping/contest_main";
import { scraping_contest_list, contest_list } from "./scraping/contest_list";
// import { save_session } from "../save/save_session";
import { store } from "../save/save";
import { Atcoder } from "./atcoder";
import { timerApi } from "../clock/timer";
import { hisuiEvent } from "../event/event";
import { contestName } from "../interfaces";
import { logger } from "../tool/logger/logger";
import { ipcMainManager } from "../ipc/ipc";
const NodeCache = require("node-cache");
const myCache = new NodeCache();

export class contestData {
  private DefaultContestID: contestName;
  constructor() {
    this.DefaultContestID = store.get("DefaultContestID", "abc127");
    this.setupDefaultContestID();
  }
  /**
   * 存在しないコンテストがデフォルトに登録されている場合に起動時に弾く
   */
  async setupDefaultContestID() {
    const getcheckdata = await this.checkContestID(this.DefaultContestID);
    if (!getcheckdata) {
      this.DefaultContestID = "abc127";
      store.set("DefaultContestID", "abc127");
      // イベントを発行
      hisuiEvent.emit("DefaultContestID-change", "abc127");
      ipcMainManager.send("LISTENER_CHANGE_SET_CONTESTID", "abc127");
      // dashboardを更新
      ipcMainManager.send("LISTENER_UPDATE_DASHBOARD");
    }
  }
  /**
   * デフォルトのコンテストIDを設定する
   * 存在をチェックし存在すればデフォルトとして設定
   * しなければfalseを返す
   */
  async setDefaultContestID(contestName: string) {
    const check = await this.checkContestID(contestName);
    if (check) {
      store.set("DefaultContestID", contestName);
      this.DefaultContestID = contestName;
      // イベントを発行
      hisuiEvent.emit("DefaultContestID-change", contestName);
      ipcMainManager.send("LISTENER_CHANGE_SET_CONTESTID", contestName);
      // dashboardを更新
      ipcMainManager.send("LISTENER_UPDATE_DASHBOARD");
      // timerをアップデート
      timerApi.setup();
      return true;
    } else {
      return false;
    }
  }
  getDefaultContestID() {
    return this.DefaultContestID;
  }
  /*
   * 開催中・開催予定のコンテストを取得し出力
   */
  async getContestInfo(): Promise<contest_list[]> {
    logger.info(`Get ContestInfo`, "ContestDataAPI");

    const cache = myCache.get("ContestInfo");
    const url_contest: string = "https://atcoder.jp/contests/?lang=ja";
    if (cache === undefined) {
      const getData = Atcoder.axiosInstance.get(url_contest);
      const data = await getData;
      const data_after = scraping_contest_list(data.data);

      myCache.set("ContestInfo", { data: data_after, time: Date.now() }, 300);
      logger.info("set myCache getContestInfo", "ContestDataAPI");

      return data_after;
    } else {
      logger.info("load myCache getContestInfo", "ContestDataAPI");
      return cache.data;
    }
  }
  /**
   * コンテストが存在するかチェックする
   * 存在しない時はfalseするときはtrue
   * 認証による権限の関係でアクセスできない場合はfalse
   */
  async checkContestID(taskScreenName: string) {
    // スラッシュが入っていても設定されてしまう問題をここで弾く
    if (taskScreenName.includes("/")) {
      return false;
    }
    logger.info("run check_SetContestID", "ContestDataAPI");
    const url = `https://atcoder.jp/contests/${taskScreenName}`;
    const responce = await Atcoder.axiosInstance.get(url, {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status < 500;
      },
    });
    if (responce.status === 200) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * contestID初期値 this.DefaultContestID
   * 開始時間と終了時間を取得
   * @return { start_time: string, end_time: string }
   */
  async getContestDate(contestID: string = this.DefaultContestID): Promise<
    | {
        start_time: any;
        end_time: any;
      }
    | "error"
  > {
    logger.info(`get ContestDate:id=${contestID}`, "ContestDataAPI");
    const cache = myCache.get(`Date_${contestID}`);
    if (cache === undefined) {
      const url = `https://atcoder.jp/contests/${contestID}`;
      const responce = await Atcoder.axiosInstance.get(url, {
        maxRedirects: 0,
        validateStatus: (status) =>
          (status >= 200 && status < 300) || status === 302,
      });
      if (responce.status !== 302) {
        // console.log(responce.data);
        const data: any = contest_main(responce.data);
        myCache.set(
          `Date_${contestID}`,
          { data: data, time: Date.now() },
          21600
        );
        logger.info(`get ContestDate:id=${contestID}`, "ContestDataAPI");
        return data;
      } else {
        logger.error(`can't get ContestDate`, "ContestDataAPI");
        return "error";
      }
    } else {
      logger.info(`load ContestDate:id=${contestID}`, "ContestDataAPI");
      return cache.data;
    }
  }
}
export const contestDataApi = new contestData();
