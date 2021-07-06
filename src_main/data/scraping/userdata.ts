//atcoder.jp/users/------をスクレイピングする
const { JSDOM } = require("jsdom");
export interface UserData {
  UserScreenName: string;
  Rating: number;
  AtCoderRank: string;
  Country: string | null;
  //所属
  Affiliation: string | null;
}
/**
 * @module scraping_contest_list
 * @param {string} body - atcoder.jp/users/---をスクレイピング
 * @return {UserData} - arrayにして返す
 */
export async function scrapingUserData(body: any) {
  const dom = new JSDOM(body);
  const UserScreenName = dom.window.document
    .querySelector(".username")
    .textContent.trim();

  const tableAll = dom.window.document.querySelectorAll(".dl-table");
  //必須データはテーブル１、任意データはテーブル２に入っている
  const table1 = tableAll[0].querySelectorAll("td");
  const tableCheck1be = tableAll[0].querySelectorAll("th");
  const tableCheck1 = [].map.call(tableCheck1be, (element: any) =>
    element.textContent.trim()
  );

  const table2 = tableAll[1].querySelectorAll("td");
  const Rating = Number(table2[1].textContent.trim());
  const AtCoderRank = String(table2[0].textContent.trim());

  const Countryindex = tableCheck1.indexOf("国と地域");
  function Countryfn(Countryindex: number) {
    if (Countryindex !== -1) {
      return String(table1[Countryindex].textContent.trim());
    } else {
      return null;
    }
  }
  const Country = Countryfn(Countryindex);

  const Affiliationindex = tableCheck1.indexOf("所属");
  function Affiliationfn(Affiliationindex: number) {
    if (Affiliationindex !== -1) {
      return String(table1[Affiliationindex].textContent.trim());
    } else {
      return null;
    }
  }
  const Affiliation = Affiliationfn(Affiliationindex);

  const UserData: UserData = {
    UserScreenName,
    Rating,
    AtCoderRank,
    Country,
    Affiliation,
  };
  return UserData;
}
