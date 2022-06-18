import fs from "fs/promises";
import path from "path";
import { scrapingSubmissionStatusData } from "../../submissions-status";
async function runTasklist(filename: string) {
  const get = await fs.readFile(path.join(__dirname, filename), "utf-8");

  const returndata = scrapingSubmissionStatusData(JSON.parse(get), {
    waiting_judge: false,
    created: "2022-06-11T17:55:47+09:00",
    contestName: "abc254",
    taskScreenName: "abc254_a",
    taskname_render: "A - Last Two Digits",
    task_url: "/contests/abc254/tasks/abc254_a",
    user: "compose",
    language: "Python (3.8.2)",
    score: "100",
    source_length: "31 Byte",
    result: "WJ",
    result_explanation: "ジャッジ中",
    time_consumption: "-- ms",
    memory_consumption: "-- KB",
    submit_id: "32368740",
    submit_url: "/contests/abc254/submissions/32368740",
  });
  return returndata;
}
const ans = {
  submissionData: {
    waiting_judge: false,
    created: "2022-06-11T17:55:47+09:00",
    contestName: "abc254",
    taskScreenName: "abc254_a",
    taskname_render: "A - Last Two Digits",
    task_url: "/contests/abc254/tasks/abc254_a",
    user: "compose",
    language: "Python (3.8.2)",
    score: "100",
    source_length: "31 Byte",
    result: "AC",
    result_explanation: "Accepted",
    time_consumption: "24 ms",
    memory_consumption: "8924 KB",
    submit_id: "32368740",
    submit_url: "/contests/abc254/submissions/32368740",
  },
  status: "AC",
  labelColor: "success",
  Interval: undefined,
};
const filelist = ["1.json"];
filelist.forEach(async (name) => {
  test("scraping submission Status", async () => {
    const data = await runTasklist(name);
    expect(data).toStrictEqual(ans);
  });
});
