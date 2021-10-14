// atcoder.jp/contests/をスクレイピングする
import { JSDOM } from "jsdom";
import dayjs from "dayjs";
export type contest_status = "upcoming" | "action" | "recent";
export interface contest_list {
  contest_name: string;
  contestID: string;
  start_time: string;
  status: contest_status;
}
const recent_limit = 10;
export function scraping_contest_list(body: any): contest_list[] {
  const dom = new JSDOM(body);
  const contest_list: contest_list[] = [];

  function get_List(divID: string, status: contest_status, limit?: number) {
    const contest = dom.window.document.querySelector(divID);
    if (contest !== null) {
      const contestsNodeList = contest
        .querySelector("tbody")
        ?.querySelectorAll("tr");
      if (contestsNodeList) {
        const contestArrey = Array.from(contestsNodeList).slice(0, limit);
        contestArrey.forEach((ele: any) => {
          const tagA = ele.querySelectorAll("a");
          const name = tagA[1].textContent?.trim();
          // substr --- /contests/ を取り除く
          const url = tagA[1].getAttribute("href")?.substr(10);
          const time = ele.querySelector("time")?.textContent;
          const time_format = dayjs(time).format();
          contest_list.push({
            contest_name: String(name),
            contestID: String(url),
            start_time: String(time_format),
            status,
          });
        });
      }
    }
  }

  get_List("#contest-table-action", "action");
  get_List("#contest-table-upcoming", "upcoming");
  get_List("#contest-table-recent", "recent", recent_limit);

  return contest_list;
}
