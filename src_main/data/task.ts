//問題情報に関するモジュール
//Copyright © 2021 adenohitu. All rights reserved.
import dayjs from "dayjs";
import EventEmitter from "events";
import { Atcoder } from "./atcoder";
import { contestDataApi } from "./contestdata";
import { scrapingTaskList, taskList } from "./scraping/tasklist";
const cacheTime = 4000;
class TaskList {
  tasklist: taskList[];
  lastestUpdate: number | undefined;
  load: boolean;
  emitter: EventEmitter;
  constructor() {
    this.tasklist = [];
    this.load = false;
    this.emitter = new EventEmitter();
  }
  async getTaskList(cache: boolean = true) {
    if (this.load === true) {
      var serf = this;
      const promise: Promise<taskList[]> = new Promise(function (
        resolve,
        reject
      ) {
        serf.emitter.once("UPDATE_TASKLIST", (arg) => {
          resolve(arg);
        });
      });
      return promise;
    } else if (
      this.lastestUpdate === undefined ||
      this.lastestUpdate + cacheTime <= Date.now()
    ) {
      this.load = true;
      this.tasklist = await getTasklist();
      this.lastestUpdate = Date.now();
      this.load = false;
      this.emitter.emit("UPDATE_TASKLIST", this.tasklist);
      return this.tasklist;
    } else {
      console.log(
        `load_TaskList:updateLastest ${dayjs(this.lastestUpdate).format(
          "YYYY-MM-DDTHH:mm:ssZ[Z]"
        )}`
      );
      return this.tasklist;
    }
  }
}
export const TaskListApi = new TaskList();
/**
 * 問題の一覧を取得
 */
export async function getTasklist(
  ContestID: string = contestDataApi.getDefaultContestID()
) {
  const standings_url = `https://atcoder.jp/contests/${ContestID}/tasks/`;
  const data = await Atcoder.axiosInstance.get(standings_url, {
    maxRedirects: 0,
    validateStatus: function (status) {
      return status < 500;
    },
  });

  if (data.status === 200) {
    const returnData = await scrapingTaskList(data.data, ContestID);
    return returnData;
  } else {
    return [];
  }
}
