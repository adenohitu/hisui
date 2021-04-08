//atcoder.jp/contests/*/submissions/meをスクレイピングする
const { JSDOM } = require("jsdom");
const dayjs = require("dayjs");
function contest_main(body: any) {
  const dom = new JSDOM(body);
  const start_time: any = dayjs(
    dom.window.document
      .querySelector(".contest-duration")
      .querySelectorAll("time")[0]
      .textContent.trim()
  ).format();
  const end_time: any = dayjs(
    dom.window.document
      .querySelector(".contest-duration")
      .querySelectorAll("time")[1]
      .textContent.trim()
  ).format();
  return { start_time: start_time, end_time: end_time };
}

export default contest_main;
