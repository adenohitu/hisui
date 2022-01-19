import { createTaskcontFromOriginalURL } from "./taskurl-preser";

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
