import fs from "fs/promises";
import scraping_submissions_list from "../../submissions";
async function runTasklist() {
  const get = await fs.readFile(__dirname + "/test.html", "utf-8");
  const returndata = scraping_submissions_list(get, "abc200");
  return returndata;
}
const ans = [
  {
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
  },
  {
    waiting_judge: false,
    created: "2021-12-26T14:42:50+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_a",
    taskname_render: "A - Century",
    task_url: "/contests/abc200/tasks/abc200_a",
    user: "compose",
    language: "Python (3.8.2)",
    score: "0",
    source_length: "136 Byte",
    result: "RE",
    result_explanation: "実行時エラー",
    time_consumption: "24 ms",
    memory_consumption: "8876 KB",
    submit_id: "28162503",
    submit_url: "/contests/abc200/submissions/28162503",
  },
  {
    waiting_judge: false,
    created: "2021-12-26T14:42:29+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_a",
    taskname_render: "A - Century",
    task_url: "/contests/abc200/tasks/abc200_a",
    user: "compose",
    language: "Python (3.8.2)",
    score: "0",
    source_length: "136 Byte",
    result: "RE",
    result_explanation: "実行時エラー",
    time_consumption: "24 ms",
    memory_consumption: "8980 KB",
    submit_id: "28162498",
    submit_url: "/contests/abc200/submissions/28162498",
  },
  {
    waiting_judge: false,
    created: "2021-12-26T14:42:15+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_a",
    taskname_render: "A - Century",
    task_url: "/contests/abc200/tasks/abc200_a",
    user: "compose",
    language: "C++ (GCC 9.2.1)",
    score: "0",
    source_length: "136 Byte",
    result: "CE",
    result_explanation: "コンパイルエラー",
    time_consumption: "-- ms",
    memory_consumption: "-- KB",
    submit_id: "28162491",
    submit_url: "/contests/abc200/submissions/28162491",
  },
  {
    waiting_judge: false,
    created: "2021-10-05T17:23:58+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_b",
    taskname_render: "B - 200th ABC-200",
    task_url: "/contests/abc200/tasks/abc200_b",
    user: "compose",
    language: "Python (3.8.2)",
    score: "200",
    source_length: "130 Byte",
    result: "AC",
    result_explanation: "正解",
    time_consumption: "26 ms",
    memory_consumption: "8976 KB",
    submit_id: "26366610",
    submit_url: "/contests/abc200/submissions/26366610",
  },
  {
    waiting_judge: false,
    created: "2021-10-02T00:34:04+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_b",
    taskname_render: "B - 200th ABC-200",
    task_url: "/contests/abc200/tasks/abc200_b",
    user: "compose",
    language: "Python (3.8.2)",
    score: "200",
    source_length: "130 Byte",
    result: "AC",
    result_explanation: "正解",
    time_consumption: "27 ms",
    memory_consumption: "9060 KB",
    submit_id: "26258448",
    submit_url: "/contests/abc200/submissions/26258448",
  },
  {
    waiting_judge: false,
    created: "2021-09-20T00:03:22+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_a",
    taskname_render: "A - Century",
    task_url: "/contests/abc200/tasks/abc200_a",
    user: "compose",
    language: "Python (3.8.2)",
    score: "100",
    source_length: "73 Byte",
    result: "AC",
    result_explanation: "正解",
    time_consumption: "27 ms",
    memory_consumption: "9052 KB",
    submit_id: "25996591",
    submit_url: "/contests/abc200/submissions/25996591",
  },
  {
    waiting_judge: false,
    created: "2021-09-20T00:02:15+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_a",
    taskname_render: "A - Century",
    task_url: "/contests/abc200/tasks/abc200_a",
    user: "compose",
    language: "Python (3.8.2)",
    score: "100",
    source_length: "73 Byte",
    result: "AC",
    result_explanation: "正解",
    time_consumption: "30 ms",
    memory_consumption: "9092 KB",
    submit_id: "25996537",
    submit_url: "/contests/abc200/submissions/25996537",
  },
  {
    waiting_judge: false,
    created: "2021-08-06T21:03:55+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_a",
    taskname_render: "A - Century",
    task_url: "/contests/abc200/tasks/abc200_a",
    user: "compose",
    language: "Python (3.8.2)",
    score: "100",
    source_length: "77 Byte",
    result: "AC",
    result_explanation: "正解",
    time_consumption: "27 ms",
    memory_consumption: "9140 KB",
    submit_id: "24809747",
    submit_url: "/contests/abc200/submissions/24809747",
  },
  {
    waiting_judge: false,
    created: "2021-08-04T16:18:54+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_a",
    taskname_render: "A - Century",
    task_url: "/contests/abc200/tasks/abc200_a",
    user: "compose",
    language: "Python (3.8.2)",
    score: "100",
    source_length: "73 Byte",
    result: "AC",
    result_explanation: "正解",
    time_consumption: "28 ms",
    memory_consumption: "8996 KB",
    submit_id: "24770892",
    submit_url: "/contests/abc200/submissions/24770892",
  },
  {
    waiting_judge: false,
    created: "2021-07-25T18:52:57+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_a",
    taskname_render: "A - Century",
    task_url: "/contests/abc200/tasks/abc200_a",
    user: "compose",
    language: "Python (3.8.2)",
    score: "100",
    source_length: "73 Byte",
    result: "AC",
    result_explanation: "正解",
    time_consumption: "23 ms",
    memory_consumption: "9060 KB",
    submit_id: "24534134",
    submit_url: "/contests/abc200/submissions/24534134",
  },
  {
    waiting_judge: false,
    created: "2021-07-24T23:20:04+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_a",
    taskname_render: "A - Century",
    task_url: "/contests/abc200/tasks/abc200_a",
    user: "compose",
    language: "C (GCC 9.2.1)",
    score: "0",
    source_length: "77 Byte",
    result: "CE",
    result_explanation: "コンパイルエラー",
    time_consumption: "-- ms",
    memory_consumption: "-- KB",
    submit_id: "24518106",
    submit_url: "/contests/abc200/submissions/24518106",
  },
  {
    waiting_judge: false,
    created: "2021-07-24T15:29:10+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_a",
    taskname_render: "A - Century",
    task_url: "/contests/abc200/tasks/abc200_a",
    user: "compose",
    language: "Python (3.8.2)",
    score: "100",
    source_length: "73 Byte",
    result: "AC",
    result_explanation: "正解",
    time_consumption: "23 ms",
    memory_consumption: "9140 KB",
    submit_id: "24472508",
    submit_url: "/contests/abc200/submissions/24472508",
  },
  {
    waiting_judge: false,
    created: "2021-05-08T23:55:36+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_c",
    taskname_render: "C - Ringo's Favorite Numbers 2",
    task_url: "/contests/abc200/tasks/abc200_c",
    user: "compose",
    language: "Python (3.8.2)",
    score: "300",
    source_length: "188 Byte",
    result: "AC",
    result_explanation: "正解",
    time_consumption: "98 ms",
    memory_consumption: "33064 KB",
    submit_id: "22442943",
    submit_url: "/contests/abc200/submissions/22442943",
  },
  {
    waiting_judge: false,
    created: "2021-05-08T21:21:42+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_c",
    taskname_render: "C - Ringo's Favorite Numbers 2",
    task_url: "/contests/abc200/tasks/abc200_c",
    user: "compose",
    language: "Python (3.8.2)",
    score: "0",
    source_length: "172 Byte",
    result: "TLE",
    result_explanation: "実行時間制限超過",
    time_consumption: "2206 ms",
    memory_consumption: "31544 KB",
    submit_id: "22414371",
    submit_url: "/contests/abc200/submissions/22414371",
  },
  {
    waiting_judge: false,
    created: "2021-05-08T21:04:52+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_b",
    taskname_render: "B - 200th ABC-200",
    task_url: "/contests/abc200/tasks/abc200_b",
    user: "compose",
    language: "Python (3.8.2)",
    score: "200",
    source_length: "153 Byte",
    result: "AC",
    result_explanation: "正解",
    time_consumption: "28 ms",
    memory_consumption: "9152 KB",
    submit_id: "22401225",
    submit_url: "/contests/abc200/submissions/22401225",
  },
  {
    waiting_judge: false,
    created: "2021-05-08T21:02:28+09:00",
    contestName: "abc200",
    taskScreenName: "abc200_a",
    taskname_render: "A - Century",
    task_url: "/contests/abc200/tasks/abc200_a",
    user: "compose",
    language: "Python (3.8.2)",
    score: "100",
    source_length: "77 Byte",
    result: "AC",
    result_explanation: "正解",
    time_consumption: "29 ms",
    memory_consumption: "9180 KB",
    submit_id: "22396532",
    submit_url: "/contests/abc200/submissions/22396532",
  },
];
test("scraping submissions", async () => {
  const data = await runTasklist();
  expect(data).toStrictEqual(ans);
});
