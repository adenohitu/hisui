export interface submissionData {
  // ジャッジ中かどうか
  waiting_judge: boolean;
  // 提出日時 ISO 8601
  created: string;
  contestName: string;
  taskScreenName: string;
  taskname_render: string | null;
  task_url: string;
  user: string;
  language: string;
  score: string;
  source_length: string;
  result: string;
  result_explanation: string | null;
  time_consumption: string | null;
  memory_consumption: string | null;
  submit_id: string;
  submit_url: string;
}
/**
サンプルデータ
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
*/
