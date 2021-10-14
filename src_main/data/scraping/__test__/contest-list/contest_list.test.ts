import fs from "fs/promises";
import { scraping_contest_list } from "../../contest_list";
async function runTest() {
  const get = await fs.readFile(__dirname + "/test.html", "utf-8");
  const returndata = scraping_contest_list(get);
  return returndata;
}
const ans = [
  {
    contest_name:
      "大和証券プログラミングコンテスト2021（AtCoder Regular Contest 128）",
    contestID: "arc128",
    start_time: "2021-10-16T21:00:00+09:00",
    status: "upcoming",
  },
  {
    contest_name: "AtCoder Beginner Contest 223",
    contestID: "abc223",
    start_time: "2021-10-17T21:00:00+09:00",
    status: "upcoming",
  },
  {
    contest_name: "AtCoder Beginner Contest 224",
    contestID: "abc224",
    start_time: "2021-10-23T21:00:00+09:00",
    status: "upcoming",
  },
  {
    contest_name: "AtCoder Regular Contest 129",
    contestID: "arc129",
    start_time: "2021-10-24T21:40:00+09:00",
    status: "upcoming",
  },
  {
    contest_name: "AtCoder Grand Contest 055",
    contestID: "agc055",
    start_time: "2021-10-31T21:00:00+09:00",
    status: "upcoming",
  },
  {
    contest_name: "Hitachi Hokudai Lab. & Hokkaido University Contest 2021",
    contestID: "hokudai-hitachi2021",
    start_time: "2021-11-05T00:00:00+09:00",
    status: "upcoming",
  },
  {
    contest_name: "AtCoder Beginner Contest 226",
    contestID: "abc226",
    start_time: "2021-11-07T21:00:00+09:00",
    status: "upcoming",
  },
  {
    contest_name:
      "キーエンスプログラミングコンテスト2021-Nov. (AtCoder Beginner Contest 227)",
    contestID: "abc227",
    start_time: "2021-11-13T21:00:00+09:00",
    status: "upcoming",
  },
  {
    contest_name:
      "デジタルの日特別イベント「HACK TO THE FUTURE for Youth+」 open",
    contestID: "future-fif-digital-days-open",
    start_time: "2021-10-10T13:30:00+09:00",
    status: "recent",
  },
  {
    contest_name: "デジタルの日特別イベント「HACK TO THE FUTURE for Youth+」",
    contestID: "future-fif-digital-days",
    start_time: "2021-10-10T13:30:00+09:00",
    status: "recent",
  },
  {
    contest_name:
      "エクサウィザーズプログラミングコンテスト2021（AtCoder Beginner Contest 222）",
    contestID: "abc222",
    start_time: "2021-10-09T21:00:00+09:00",
    status: "recent",
  },
  {
    contest_name: "AtCoder Beginner Contest 221",
    contestID: "abc221",
    start_time: "2021-10-02T21:00:00+09:00",
    status: "recent",
  },
  {
    contest_name: "AtCoder Beginner Contest 220",
    contestID: "abc220",
    start_time: "2021-09-26T21:00:00+09:00",
    status: "recent",
  },
  {
    contest_name: "AtCoder Regular Contest 127",
    contestID: "arc127",
    start_time: "2021-09-25T20:00:00+09:00",
    status: "recent",
  },
  {
    contest_name: "AtCoder Regular Contest 126",
    contestID: "arc126",
    start_time: "2021-09-19T22:00:00+09:00",
    status: "recent",
  },
  {
    contest_name:
      "サイシードプログラミングコンテスト2021（AtCoder Beginner Contest 219）",
    contestID: "abc219",
    start_time: "2021-09-18T21:00:00+09:00",
    status: "recent",
  },
  {
    contest_name: "第八回 アルゴリズム実技検定",
    contestID: "past202109-open",
    start_time: "2021-09-18T13:00:00+09:00",
    status: "recent",
  },
  {
    contest_name: "JOI 2021/2022 一次予選 (第1回) 過去問",
    contestID: "joi2022yo1a",
    start_time: "2021-09-18T14:00:00+09:00",
    status: "recent",
  },
];
test("scraping SampleCase", async () => {
  const data = await runTest();
  expect(data).toEqual(ans);
});
