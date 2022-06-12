import { logger } from "../tool/logger/logger";
import { Atcoder } from "./atcoder";
import { scrapingUserData, UserData } from "./scraping/userdata";

let cacheData: any;

/**
 * ユーザーデータを取得
 */
export async function getUserData(
  userScreenName: string | undefined = Atcoder.getUsername()
): Promise<"reqError" | "notSetUser" | UserData> {
  if (userScreenName !== undefined) {
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
        cacheData = returnData;
        setInterval(() => {
          cacheData = undefined;
        }, 360000);
        logger.info(`GetUserStatus:${userScreenName}`, "UserDataFn");
        return returnData;
      } else {
        return "reqError";
      }
    } else {
      logger.info(`LoadUserStatus:${userScreenName}`, "UserDataFn");
      return cacheData;
    }
  } else {
    return "notSetUser";
  }
}
