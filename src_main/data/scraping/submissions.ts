import { createTaskcontFromOriginalURL_NoOrigin } from "../../tool/taskurl-parser";
import { submissionData } from "../submissions-type";

//atcoder.jp/contests/*/submissions/meをスクレイピングする
const { JSDOM } = require("jsdom");
const dayjs = require("dayjs");
/**
 * submission ページをスクレイピング
 */
async function scraping_submissions_list(body: any, contestID: string) {
  const dom = new JSDOM(body);
  //   var alllist: any = [];
  const check_null = dom.window.document.querySelector(".panel-body");
  if (check_null === null) {
    const submit_div: any = dom.window.document
      .querySelector(".table-responsive")
      .querySelector("tbody");
    const submit_list_body: NodeList = submit_div.querySelectorAll("tr");
    //リストで出力
    const submit_list: submissionData[] = Array.from(submit_list_body).map(
      (element: any) => {
        const classcheck_waiting_judge =
          element.querySelectorAll(".waiting-judge");
        let waiting_judge;
        if (classcheck_waiting_judge.length === 0) {
          waiting_judge = false;
        } else {
          waiting_judge = true;
        }
        const created: any = dayjs(
          element.querySelectorAll("td")[0].textContent.trim()
        ).format();
        const taskname_render: any = element
          .querySelectorAll("td")[1]
          .querySelector("a")
          .textContent.trim();
        const task_url: any = element
          .querySelectorAll("td")[1]
          .querySelector("a")
          .getAttribute("href");
        const user: any = element
          .querySelectorAll("td")[2]
          .querySelector("a")
          .textContent.trim();
        const language: any = element
          .querySelectorAll("td")[3]
          .querySelector("a")
          .textContent.trim();
        const score: any = element.querySelectorAll("td")[4].textContent.trim();
        const submit_id: any = element
          .querySelectorAll("td")[4]
          .getAttribute("data-id");
        const source_length: any = element
          .querySelectorAll("td")[5]
          .textContent.trim();
        const resultCol_All: any = element.querySelectorAll("td")[6];
        // URLをパースしてtaskScreenNameを取得
        const urlParse = createTaskcontFromOriginalURL_NoOrigin(
          `https://atcoder.jp${task_url}`
        );

        // CEなどの場合colが３になるのでここで場合分け
        if (resultCol_All.getAttribute("colspan") === "3") {
          const result = resultCol_All.querySelector("span").textContent.trim();
          const result_explanation = resultCol_All
            .querySelector("span")
            .getAttribute("title");
          const submit_url: any = element
            .querySelectorAll("td")[7]
            .querySelector("a")
            .getAttribute("href");
          const return_data: submissionData = {
            waiting_judge,
            created,
            contestName: contestID,
            taskScreenName: urlParse.taskScreenName,
            taskname_render,
            task_url,
            user,
            language,
            score,
            source_length,
            result,
            result_explanation,
            time_consumption: "-- ms",
            memory_consumption: "-- KB",
            submit_id,
            submit_url,
          };
          return return_data;
        } else {
          const result = resultCol_All.querySelector("span").textContent.trim();
          const result_explanation: any = resultCol_All
            .querySelector("span")
            .getAttribute("title");
          const time_consumption: any = element
            .querySelectorAll("td")[7]
            .textContent.trim();
          const memory_consumption: any = element
            .querySelectorAll("td")[8]
            .textContent.trim();
          const submit_url: any = element
            .querySelectorAll("td")[9]
            .querySelector("a")
            .getAttribute("href");

          const return_data: submissionData = {
            waiting_judge,
            created,
            contestName: contestID,
            taskScreenName: urlParse.taskScreenName,
            taskname_render,
            task_url,
            user,
            language,
            score,
            source_length,
            result,
            result_explanation,
            time_consumption,
            memory_consumption,
            submit_id,
            submit_url,
          };
          return return_data;
        }
      }
    );
    // console.log(typeof submit_list);

    return submit_list;
  } else {
    return [];
  }
}
/**
 * @module scraping_contest_list
 * @param {string} body - atcoder.jp/contest/---/submissions/meのソースを渡す
 * @return {JSON} - jsonにして返す
 */
export default scraping_submissions_list;
