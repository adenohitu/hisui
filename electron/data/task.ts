//問題情報に関するモジュール
//Copyright © 2021 adenohitu. All rights reserved.
import { Atcoder } from "./atcoder";
import { getContestID } from "./contestData";
import { scrapingTaskList } from "./scraping/tasklist";
/**
 *
 * @param contest_short_name
 * @returns {taskList}
 */
export async function getTasklist(contest_short_name: string = getContestID()) {
  const standings_url = `https://atcoder.jp/contests/${contest_short_name}/tasks/`;
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
