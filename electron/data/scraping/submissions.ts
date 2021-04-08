//atcoder.jp/contests/*/submissions/meをスクレイピングする
const { JSDOM } = require("jsdom");
const dayjs = require("dayjs");
async function scraping_submissions_list(body: any) {
  const dom = new JSDOM(body);
  //   var alllist: any = [];
  const check_null = dom.window.document.querySelector(".panel-body");
  if (check_null === null) {
    const submit_div: any = dom.window.document
      .querySelector(".table-responsive")
      .querySelector("tbody");
    const submit_list_body = submit_div.querySelectorAll("tr");
    //リストで出力
    const submit_list = [].map.call(submit_list_body, (element: any) => {
      const created: any = dayjs(
        element.querySelectorAll("td")[0].textContent.trim()
      ).format();
      const task: any = element
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
      const result: any = element.querySelectorAll("td")[6].textContent.trim();
      const result_explanation: any = element
        .querySelectorAll("td")[6]
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

      const return_data: any = {
        created,
        task,
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
    });
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
