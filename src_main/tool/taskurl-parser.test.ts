import {
  createTaskcontFromOriginalURL,
  getcontestIDFromOriginalURL,
} from "./taskurl-parser";

const sample = [
  {
    URL: "https://atcoder.jp/contests/abc221/tasks/abc221_a/",
    ans: { contestName: "abc221", taskScreenName: "abc221_a" },
  },
  {
    URL: "https://atcoder.jp/contests/abc221/tasks/abc221_a",
    ans: { contestName: "abc221", taskScreenName: "abc221_a" },
  },
  {
    URL: "https://atcoder.jp/contests/rcl-contest-2021/tasks/rcl_contest_2021_a",
    ans: {
      contestName: "rcl-contest-2021",
      taskScreenName: "rcl_contest_2021_a",
    },
  },
  {
    URL: "https://atcoder.jp/contests/abc231/tasks/abc231_a/editorial",
    ans: null,
  },
];
test("task URL scrapping1", async () => {
  sample.forEach((sample_arg) => {
    const result = createTaskcontFromOriginalURL(sample_arg.URL);
    expect(result).toEqual(sample_arg.ans);
  });
});
const sample2 = [
  {
    URL: "https://atcoder.jp/contests/abc221/tasks/abc221_a/",
    ans: { contestID: "abc221", isContestMainPage: false },
  },
  {
    URL: "https://atcoder.jp/contests/abc221/tasks/abc221_a",
    ans: { contestID: "abc221", isContestMainPage: false },
  },
  {
    URL: "https://atcoder.jp/contests/abc221/",
    ans: { contestID: "abc221", isContestMainPage: true },
  },
  {
    URL: "https://atcoder.jp/contests/abc221",
    ans: { contestID: "abc221", isContestMainPage: true },
  },
  {
    URL: "https://atcoder.jp/contests/rcl-contest-2021/tasks/rcl_contest_2021_a",
    ans: { contestID: "rcl-contest-2021", isContestMainPage: false },
  },
  {
    URL: "https://atcoder.jp/contests/abc231/tasks/abc231_a/editorial",
    ans: { contestID: "abc231", isContestMainPage: false },
  },
  {
    URL: "https://atcoder.jp/contests/",
    ans: null,
  },
  {
    URL: "https://atcoder.jp/contests",
    ans: null,
  },
];
test("get ContestID URL scrapping1", async () => {
  sample2.forEach((sample_arg) => {
    const result = getcontestIDFromOriginalURL(sample_arg.URL);
    expect(result).toEqual(sample_arg.ans);
  });
});
