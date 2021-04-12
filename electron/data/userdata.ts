import { Atcoder } from "./atcoder";
import { scrapingUserData } from "./scraping/userdata";
const NodeCache = require("node-cache");
const myCache = new NodeCache();
export const getUserData = async (userid: string = Atcoder.getUsername()) => {
  const cacheData = myCache.get(`User_${userid}`);
  const userDataUrl = `https://atcoder.jp/users/${userid}?lang=ja`;
  if (cacheData === undefined) {
    const data = await Atcoder.axiosInstance.get(userDataUrl, {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status < 500;
      },
    });
    if (data.status === 200) {
      const returnData = await scrapingUserData(data.data);
      myCache.set(`User_${userid}`, returnData, 3600);
      console.log(`user:${userid}_set`);
      return returnData;
    } else {
      return "reqError";
    }
  } else {
    console.log(`user:${userid}_load`);
    return cacheData;
  }
};
