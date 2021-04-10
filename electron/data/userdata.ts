import { Atcoder } from "./atcoder";
import { scrapingUserData } from "./scraping/userdata";
export const getUserData = async (userid: string = Atcoder.getUsername()) => {
  const userDataUrl = `https://atcoder.jp/users/${userid}?lang=ja`;
  const data = await Atcoder.axiosInstance.get(userDataUrl, {
    maxRedirects: 0,
    validateStatus: function (status) {
      return status < 500;
    },
  });

  if (data.status === 200) {
    const returnData = await scrapingUserData(data.data);
    return returnData;
  } else {
    return "reqError";
  }
};
