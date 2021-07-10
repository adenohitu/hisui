//コンテスト情報に関するモジュール
//Copyright © 2021 adenohitu. All rights reserved.
import contest_main from "./scraping/contest_main";
import scraping_contest_list from "./scraping/contest_list";
// import { save_session } from "../save/save_session";
import { store } from "../save/save";
import { Atcoder } from "./atcoder";
import { dashboardapi } from "../browserview/dashboardview";
import { timerApi } from "../clock/timer";
import { hisuiEvent } from "../event/event";
import { ipcSendall } from "../browserview/mgt/ipcall";
const NodeCache = require("node-cache");
const myCache = new NodeCache();

export class contestData {
  private DefaultContestID: string;
  constructor() {
    this.DefaultContestID = store.get("DefaultContestID", "abc001");
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
      ipcSendall("changeDefaultContestID", contestName);
      // dashboardを更新
      dashboardapi.runUpdatedata();
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
  async getContestInfo(): Promise<
    {
      contest_name: string;
      taskScreenName: string;
      start_time: any;
      active: boolean;
    }[]
  > {
    console.log("run getContestInfo");
    const cache = myCache.get("ContestInfo");
    const url_contest: string = "https://atcoder.jp/contests/?lang=ja";
    if (cache === undefined) {
      const getData = Atcoder.axiosInstance.get(url_contest);
      const data = await getData;
      const data_after = scraping_contest_list(data.data);

      myCache.set("ContestInfo", { data: data_after, time: Date.now() }, 300);
      console.log("set getContestInfo");
      return data_after;
    } else {
      console.log("load getContestInfo");
      return cache.data;
    }
  }
  /**
   * コンテストが存在するかチェックする
   * 存在しない時はfalseするときはtrue
   * 認証による権限の関係でアクセスできない場合はfalse
   */
  async checkContestID(taskScreenName: string) {
    console.log("run check_SetContestID");
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
   * @param contestID
   * 開始時間と終了時間を取得
   * @return { start_time: string, end_time: string }
   */
  async getContestDate(
    contestID: string = this.DefaultContestID
  ): Promise<any> {
    console.log("run get_date");
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
        console.log("set get_date");

        return data;
      } else {
        console.log("error");

        return undefined;
      }
    } else {
      console.log("load get_date");

      return cache.data;
    }
  }
}
export const contestDataApi = new contestData();
