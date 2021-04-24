//コンテスト情報に関するモジュール
//Copyright © 2021 adenohitu. All rights reserved.
import contest_main from "./scraping/contest_main";
import scraping_submissions_list from "./scraping/submissions";
import scraping_contest_list from "./scraping/contest_list";
// import { save_session } from "../save/save_session";
import { store } from "../save/save";
import { Atcoder } from "./atcoder";
const NodeCache = require("node-cache");
const myCache = new NodeCache();
/**
 * デフォルトで設定されたコンテストIDを返す
 */
export function getDefaultContestID(): string {
  return store.get("SetContestID", "abc001");
}

/**
 * 開催中・開催予定のコンテストを取得し出力
 */
export async function getContestInfo(): Promise<
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
 * デフォルトのコンテストIDを設定する
 * 存在をチェックし存在すればデフォルトとして設定
 * しなければfalseを返す
 */
export async function setDefaultContestID(taskScreenName: string) {
  console.log("run set_SetContestID");
  const check = await checkContestID(taskScreenName);
  if (check) {
    await store.set("SetContestID", taskScreenName);
    return true;
  } else {
    return false;
  }
}

/**
 * コンテストが存在するかチェックする
 * 存在しない時はfalseするときはtrue
 * 認証による権限の関係でアクセスできない場合はfalse
 */
export async function checkContestID(taskScreenName: string) {
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
 * @param taskScreenName
 * 開始時間と終了時間を取得
 * @return { start_time: string, end_time: string }
 */
export async function getContestDate(
  taskScreenName: string = getDefaultContestID()
): Promise<any> {
  console.log("run get_date");
  const cache = myCache.get(`Date_${taskScreenName}`);
  if (cache === undefined) {
    const url = `https://atcoder.jp/contests/${taskScreenName}`;
    const responce = await Atcoder.axiosInstance.get(url, {
      maxRedirects: 0,
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 302,
    });
    if (responce.status !== 302) {
      // console.log(responce.data);
      const data: any = contest_main(responce.data);
      myCache.set(
        `Date_${taskScreenName}`,
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

/**
 * @param taskScreenName
 * 得点情報を取得
 * @returns {json}
 */
export async function getContestScore(
  taskScreenName: string = getDefaultContestID()
): Promise<any> {
  console.log("run get_Score");
  const standings_url = `https://atcoder.jp/contests/${taskScreenName}/score/json`;
  const responce = await Atcoder.axiosInstance.get(standings_url, {
    maxRedirects: 0,
    validateStatus: function (status) {
      return status < 500;
    },
  });
  if (responce.status !== 302) {
    //そもそも予定されていないコンテストをSetContestIDに設定することはできないので404対策は付けない
    if (responce.data !== `"error"`) {
      //atcoderの謎仕様に注意
      //予定されているコンテストの場合302ではなく`"error"`（ダブルクォーテーションがいる）を返す
      return responce.data;
    } else {
      console.log("ready");
      return [];
    }
  } else {
    console.log("must login");
    return [];
  }
}

/**
 * @param taskScreenName
 * 自分の提出を取得
 */
export async function getSubmissionMe(
  taskScreenName: string = getDefaultContestID()
): Promise<any> {
  console.log("run get_submissions_me");
  const standings_url = `https://atcoder.jp/contests/${taskScreenName}/submissions/me`;
  const responce = await Atcoder.axiosInstance.get(standings_url, {
    maxRedirects: 0,
    validateStatus: function (status) {
      return status < 500;
    },
  });
  if (responce.status !== 302) {
    //提出ページが公開されていない場合は"ready"を返す
    if (responce.status !== 404) {
      const data_after = await scraping_submissions_list(responce.data);
      console.log("end get_submissions_me");
      return data_after;
    } else {
      console.log("ready");
      return [];
    }
  } else {
    console.log("must login");
    return [];
  }
}
