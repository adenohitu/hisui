//問題情報に関するモジュール
//Copyright © 2021 adenohitu. All rights reserved.
import { Atcoder } from "./atcoder";
import { getDefaultContestID } from "./contestData";
import { scrapingTaskList } from "./scraping/tasklist";
/**
 *
 * @param taskScreenName
 */
export async function getTasklist(
  taskScreenName: string = getDefaultContestID()
) {
  const standings_url = `https://atcoder.jp/contests/${taskScreenName}/tasks/`;
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
