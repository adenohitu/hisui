import { contestName } from "../../interfaces";

const { JSDOM } = require("jsdom");
export interface taskList {
  contestName: contestName;
  taskScreenName: string;
  AssignmentName: string;
  taskName: string;
  taskUrl: string;
  taskLimit: string;
  taskMemory: string;
}
/**
 * 問題情報を取得
 */
export async function scrapingTaskList(body: any, contestName: string) {
  const dom = new JSDOM(body);

  const tasklistBefore = dom.window.document.querySelector("tbody");
  const taskall: NodeList = tasklistBefore.querySelectorAll("tr");
  const tasklistAfter = Array.from(taskall).map((element: any) => {
    const taskUrl = element.querySelector("a").getAttribute("href");
    const taskScreenName = getTaskScreenName(taskUrl);
    const taskName = element.querySelectorAll("a")[1].textContent.trim();
    const tmp_td = element.querySelectorAll("td");
    const taskLimit = tmp_td[2].textContent.trim();
    const taskMemory = tmp_td[3].textContent.trim();
    const AssignmentName = element.querySelector("a").textContent.trim();
    const returnData: taskList = {
      contestName,
      taskScreenName,
      AssignmentName,
      taskName,
      taskUrl,
      taskLimit,
      taskMemory,
    };
    return returnData;
  });

  return tasklistAfter;
}

function getTaskScreenName(taskUrl: string) {
  const slashIndex = taskUrl.lastIndexOf("/") + 1;
  return taskUrl.slice(slashIndex);
}
// SampleData
/*
{
    AssignmentName: '072',
    taskName: 'Loop Railway Plan（★4）',
    taskUrl: '/contests/typical90/tasks/typical90_bt',
    taskLimit: '2 sec',
    taskMemory: '1024 MB'
}
 */
