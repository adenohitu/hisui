import { Atcoder } from "./atcoder";
import { scrapingUserData, UserData } from "./scraping/userdata";
const NodeCache = require("node-cache");
const myCache = new NodeCache();

/**
 * ユーザーデータを取得
 */
export async function getUserData(
  userScreenName: string = Atcoder.getUsername()
): Promise<"reqError" | UserData> {
  const cacheData = myCache.get(`User_${userScreenName}`);
  const userDataUrl = `https://atcoder.jp/users/${userScreenName}?lang=ja`;
  if (cacheData === undefined) {
    const data = await Atcoder.axiosInstance.get(userDataUrl, {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status < 500;
      },
    });
    if (data.status === 200) {
      const returnData = await scrapingUserData(data.data);
      myCache.set(`User_${userScreenName}`, returnData, 3600);
      console.log(`user:${userScreenName}_set`);
      return returnData;
    } else {
      return "reqError";
    }
  } else {
    console.log(`user:${userScreenName}_load`);
    return cacheData;
  }
}
