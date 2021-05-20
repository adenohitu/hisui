//atcoder.jp/contests/------/submitをスクレイピングする
const { JSDOM } = require("jsdom");
export interface taskList {
  TaskScreenName: string;
  taskData: string;
}
/**
 * 提出可能言語を取得
 */
export async function taskData(body: any) {
  const dom = new JSDOM(body);

  const taskDatabefore = dom.window.document.querySelector(".lang-ja");
  const taskdoc = taskDatabefore.querySelectorAll("section");
  const returndata = taskDatabefore.innerHTML;
  return returndata;
}
const axios = require("axios");
const run = async () => {
  const data = await axios.get(
    "https://atcoder.jp/contests/ahc002/tasks/ahc002_a"
  );
  console.log(await taskData(data.data));
};
run();
