// atcoder.jp/contests/をスクレイピングする
const { JSDOM } = require("jsdom");
const dayjs = require("dayjs");
export interface contest_list {
  contest_name: string;
  contestID: string;
  start_time: any;
  active: boolean;
}
function scraping_contest_list(body: any): contest_list[] {
  const dom = new JSDOM(body);
  var all_list = [];
  //開催中のコンテストを取得
  const contest_active = dom.window.document.querySelector(
    "#contest-table-action"
  );
  //コンテストが取得できない場合飛ばす
  if (contest_active !== null) {
    //aタグのついたものを取得
    const contest_active_a = contest_active.querySelectorAll("a");

    //nodelistをarrayに変換
    const contest_active_a_array = [].map.call(
      contest_active_a,
      (element: any) => {
        return element.textContent.trim();
      }
    );

    //urlを取得
    const contest_active_url = [].map.call(contest_active_a, (element: any) => {
      return element.getAttribute("href");
    });
    const contest_list_active_url: any = contest_active_url.filter(
      (x, y) => y % 2 === 1
    );
    // console.log(contest_list_active_url);

    // コンテストの時間を配列に
    const contest_list_active_time = contest_active_a_array.filter(
      (x, y) => y % 2 === 0
    );

    //ISO 8601に変換
    const contest_list_active_time_reformat = contest_list_active_time.map(
      (x) => dayjs(x).format()
    );

    // コンテストの名前を配列に
    const contest_list_active_name = contest_active_a_array.filter(
      (x, y) => y % 2 === 1
    );

    //出力に追加
    for (let i = 0; i < contest_list_active_name.length; i++) {
      all_list.push({
        contest_name: String(contest_list_active_name[i]),
        contestID: String(contest_list_active_url[i].substr(10)),
        start_time: String(contest_list_active_time_reformat[i]),
        active: true,
      });
    }
  }

  //開催予定のコンテストを取得
  const contest_upcoming = dom.window.document.querySelector(
    "#contest-table-upcoming"
  );
  //コンテストが取得できない場合飛ばす
  if (contest_upcoming !== null) {
    const contest_upcoming_a = contest_upcoming.querySelectorAll("a");
    //nodelistをarrayに変換
    const contest_upcoming_a_array = [].map.call(
      contest_upcoming_a,
      (element: any) => {
        return element.textContent.trim();
      }
    );
    //urlを取得
    const contest_upcoming_url = [].map.call(
      contest_upcoming_a,
      (element: any) => {
        return element.getAttribute("href");
      }
    );
    const contest_list_upcoming_url: any = contest_upcoming_url.filter(
      (x, y) => y % 2 === 1
    );
    // console.log(contest_list_upcoming_url);

    // コンテストの時間を配列に
    const contest_list_upcoming_time = contest_upcoming_a_array.filter(
      (x, y) => y % 2 === 0
    );
    //ISO 8601に変換
    const contest_list_upcoming_time_reformat = contest_list_upcoming_time.map(
      (x) => dayjs(x).format()
    );
    // コンテストの名前を配列に
    const contest_list_upcoming_name = contest_upcoming_a_array.filter(
      (x, y) => y % 2 === 1
    );
    for (let i = 0; i < contest_list_upcoming_name.length; i++) {
      all_list.push({
        contest_name: String(contest_list_upcoming_name[i]),
        contestID: String(contest_list_upcoming_url[i].substr(10)),
        start_time: String(contest_list_upcoming_time_reformat[i]),
        active: false,
      });
    }
  }
  return all_list;
}
/**
 * @module scraping_contest_list
 * @param {string} body - atcoder.jp/contestのソースを渡す
 * @return {JSON} - jsonにして返す
 */
export default scraping_contest_list;
