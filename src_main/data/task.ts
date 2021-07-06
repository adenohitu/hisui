//問題情報に関するモジュール
//Copyright © 2021 adenohitu. All rights reserved.
import { Atcoder } from "./atcoder";
import { contestDataApi } from "./contestdata";
import { scrapingTaskList } from "./scraping/tasklist";
/**
 * 問題の一覧を取得
 */
export async function getTasklist(
  ContestID: string = contestDataApi.DefaultContestID
) {
  const standings_url = `https://atcoder.jp/contests/${ContestID}/tasks/`;
  const data = await Atcoder.axiosInstance.get(standings_url, {
    maxRedirects: 0,
    validateStatus: function (status) {
      return status < 500;
    },
  });

  if (data.status === 200) {
    const returnData = await scrapingTaskList(data.data);
    return returnData;
  } else {
    return "reqError";
  }
}