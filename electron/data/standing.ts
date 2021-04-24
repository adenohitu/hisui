//順位表に関するモジュール
//Copyright © 2021 adenohitu. All rights reserved.
import { Atcoder } from "./atcoder";
import { getDefaultContestID } from "./contestData";
import { totalfn } from "./logic/standingTotal";
const NodeCache = require("node-cache");
const myCache = new NodeCache();
//大量アクセス防止のためキャッシュを残す
interface returnData {
  cache: boolean;
  login: boolean;
  time: number;
  data: any | undefined;
}
/**
 * @param contest_short_name
 * 順位表情報を取得
 * @returns {json}
 */
export async function get_Standings(
  contest_short_name: string = getDefaultContestID()
): Promise<any> {
  const cache = myCache.get(`Standing_${contest_short_name}`);
  console.log("run get_Standings");
  if (cache === undefined) {
    const standings_url = `https://atcoder.jp/contests/${contest_short_name}/standings/json`;
    const responce = await Atcoder.axiosInstance.get(standings_url, {
      maxRedirects: 0,
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 302,
    });
    if (responce.status !== 302) {
      myCache.set(
        `Standing_${contest_short_name}`,
        { data: responce.data, time: Date.now() },
        30
      );
      console.log("set cache");
      const returnData: returnData = {
        cache: false,
        login: true,
        time: Date.now(),
        data: responce.data,
      };
      return returnData;
    } else {
      console.log("not login");
      const returnData: returnData = {
        cache: false,
        login: false,
        time: Date.now(),
        data: undefined,
      };
      return returnData;
    }
  } else {
    console.log("Load cache");
    const returnData: returnData = {
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
 * @param contest_short_name
 * @returns
 */
export async function getTotal(
  contest_short_name: string = getDefaultContestID()
) {
  const data: returnData = await get_Standings(contest_short_name);
  const returndata = await totalfn(data.data);
  return returndata;
}

export async function getRank(
  contest_short_name: string = getDefaultContestID()
) {
  const username: string = Atcoder.getUsername();
  const data: returnData = await get_Standings(contest_short_name);
  const myrank: any = await data.data.StandingsData.find(
    (v: any) => v.UserScreenName === username
  );
  return myrank.Rank;
}
