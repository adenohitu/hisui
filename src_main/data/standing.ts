//順位表に関するモジュール
//Copyright © 2020-2023 adenohitu. All rights reserved.
import { Atcoder } from "./atcoder";
import { contestDataApi } from "./contestdata";
import { totalfn } from "./logic/standingTotal";
import { hisuiEvent } from "../event/event";
import dayjs from "dayjs";
import { logger } from "../tool/logger/logger";
const cacheTime = 30000;
export type standingData = any;
/**
 * ランキング情報を管理するAPI
 */
class standings {
  standingData: undefined | standingData;
  lastestUpdate: number | undefined;
  load: boolean;
  constructor() {
    this.load = false;
  }
  /**
   * 順位表を取得
   */
  async getStandings(
    taskScreenName: string = contestDataApi.getDefaultContestID(),
    cache: boolean = true
  ) {
    if (this.load === true) {
      const promise: Promise<standingData> = new Promise(function (
        resolve,
        reject
      ) {
        hisuiEvent.once("standingsData-update", (arg) => {
          resolve(arg);
        });
      });
      return promise;
    } else if (
      this.lastestUpdate === undefined ||
      this.lastestUpdate + cacheTime <= Date.now()
    ) {
      this.load = true;
      const standings_url = `https://atcoder.jp/contests/${taskScreenName}/standings/json`;
      const responce = await Atcoder.axiosInstance.get(standings_url, {
        maxRedirects: 0,
        validateStatus: (status) =>
          (status >= 200 && status < 300) || status === 302,
      });
      this.standingData = responce.data;
      this.lastestUpdate = Date.now();
      this.load = false;
      hisuiEvent.emit("standingsData-update", responce.data);
      return responce.data;
    } else {
      logger.info(
        `load_StandingsData updateLastest:${dayjs(this.lastestUpdate).format(
          "YYYY-MM-DDTHH:mm:ssZ[Z]"
        )}`,
        "standingsAPI"
      );
      return this.standingData;
    }
  }
}
export const standingsApi = new standings();

/**
 * 問題ごとに提出した人数と正解した人数を集計して返す
 */
export async function getTotal(
  taskScreenName: string = contestDataApi.getDefaultContestID()
) {
  const data = await standingsApi.getStandings(taskScreenName);
  const returndata = await totalfn(data);
  return returndata;
}
/**
 * 指定したユーザーの順位を取得
 * ユーザー名指定しない場合ログインされているユーザの順位を返す
 */
export async function getRank(
  taskScreenName: string = contestDataApi.getDefaultContestID(),
  username: string | undefined = Atcoder.getUsername()
): Promise<"error" | number> {
  if (username !== undefined) {
    const data = await standingsApi.getStandings(taskScreenName);

    const myrank: any = await data.StandingsData.find(
      (v: any) => v.UserScreenName === username
    );
    if (myrank !== undefined) {
      return myrank.Rank;
    } else {
      return "error";
    }
  } else {
    return "error";
  }
}
