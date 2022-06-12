import fs from "fs/promises";
import path from "path";
import { scraping_submitData } from "../../submit-data";
async function runTasklist(filename: string) {
  const get = await fs.readFile(path.join(__dirname, filename), "utf-8");
  const returndata = scraping_submitData(JSON.parse(get), {
    waiting_judge: false,
    created: "2021-12-26T14:43:20+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_b",
    taskname_render: "B - 200th ABC-200",
    task_url: "/contests/abc200/tasks/abc200_b",
    user: "compose",
    language: "Python (3.8.2)",
    score: "200",
    source_length: "136 Byte",
    result: "AC",
    result_explanation: "正解",
    time_consumption: "26 ms",
    memory_consumption: "9112 KB",
    submit_id: "28162516",
    submit_url: "/contests/abc200/submissions/28162516",
  });
  return returndata;
}
const filelist = ["1_wj.json", "2_tle.json", "3_ac.json"];
filelist.forEach(async (name) => {
  test("scraping submit Status", async () => {
    const data = await runTasklist(name);
    console.log(data);
    //   expect(data).toStrictEqual(ans);
  });
});
