import { logger } from "../tool/logger/logger";
import { Atcoder } from "./atcoder";
import { contestDataApi } from "./contestdata";

/**
 * 得点情報を取得
 */
export async function getContestScore(
  contestID: string = contestDataApi.getDefaultContestID()
): Promise<any> {
  logger.info("run getScore", "submissionsAPI");
  const standings_url = `https://atcoder.jp/contests/${contestID}/score/json`;
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
