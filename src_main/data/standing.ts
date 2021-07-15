//順位表に関するモジュール
//Copyright © 2021 adenohitu. All rights reserved.
import { Atcoder } from "./atcoder";
import { contestDataApi } from "./contestdata";
import { totalfn } from "./logic/standingTotal";
import { returnStandingsData } from "../interfaces";
const NodeCache = require("node-cache");
const myCache = new NodeCache();

/**
 * 順位表情報を取得
 */
export async function getStandings(
  taskScreenName: string = contestDataApi.getDefaultContestID()
): Promise<returnStandingsData> {
  const cache = myCache.get(`Standing_${taskScreenName}`);
  console.log("run get_Standings");
  if (cache === undefined) {
    const standings_url = `https://atcoder.jp/contests/${taskScreenName}/standings/json`;
    const responce = await Atcoder.axiosInstance.get(standings_url, {
      maxRedirects: 0,
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 302,
    });
    if (responce.status !== 302) {
      myCache.set(
        `Standing_${taskScreenName}`,
        { data: responce.data, time: Date.now() },
        30
      );
      console.log("set cache");
      const returnData: returnStandingsData = {
        cache: false,
        login: true,
        time: Date.now(),
        data: responce.data,
      };
      return returnData;
    } else {
      console.log("not login");
      const returnData: returnStandingsData = {
        cache: false,
        login: false,
        time: Date.now(),
        data: undefined,
      };
      return returnData;
    }
  } else {
    console.log("Load cache");
    const returnData: returnStandingsData = {
      cache: false,
      login: true,
      time: cache.time,
      data: cache.data,
    };
    return returnData;
  }
}
/**
 * 問題ごとに提出した人数と正解した人数を集計して返す
 */
export async function getTotal(
  taskScreenName: string = contestDataApi.getDefaultContestID()
) {
  const data = await getStandings(taskScreenName);
  const returndata = await totalfn(data.data);
  return returndata;
}
/**
 * 指定したユーザーの順位を取得
 * ユーザー名指定しない場合ログインされているユーザの順位を返す
 */
export async function getRank(
  taskScreenName: string = contestDataApi.getDefaultContestID(),
  username: string = Atcoder.getUsername()
) {
  const data = await getStandings(taskScreenName);
  const myrank: any = await data.data.StandingsData.find(
    (v: any) => v.UserScreenName === username
  );
  if (myrank !== undefined) {
    return myrank.Rank;
  } else {
    return -1;
  }
}
