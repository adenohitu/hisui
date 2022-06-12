//問題情報に関するモジュール
//Copyright © 2021-2022 adenohitu. All rights reserved.
import dayjs from "dayjs";
import EventEmitter from "events";
import { contestName, taskScreenName } from "../interfaces";
import { Atcoder } from "./atcoder";
import { contestDataApi } from "./contestdata";
import { scrapingTaskList, taskList } from "./scraping/tasklist";
const cacheTime = 60000;
class TaskList {
  tasklists: {
    [contestName: string]: {
      lastestUpdate?: number;
      load: boolean;
      tasklists?: taskList[];
    };
  };
  emitter: EventEmitter;
  constructor() {
    this.tasklists = {};
    this.emitter = new EventEmitter();
  }
  async getTaskList(
    cache: boolean = true,
    contestName: contestName = contestDataApi.getDefaultContestID()
  ) {
    if (this.tasklists[contestName]?.load === true) {
      // 現在TaskListを取得中なので、結果をPromiseで待つ
      var serf = this;
      const promise: Promise<taskList[]> = new Promise(function (
        resolve,
        reject
      ) {
        serf.emitter.once(contestName, (arg) => {
          resolve(arg);
        });
      });
      return promise;
    } else if (this.tasklists[contestName].tasklists === undefined) {
      // TaskListが存在しないので、取得する
      // コンテスト前に取得失敗したとき、tasklistsがundefinedであるため、取得し直す
      this.tasklists[contestName] = { load: true };
      const data = await getTasklistPage(contestName);
      if (data.length !== 0) {
        this.tasklists[contestName].tasklists = data;
        this.tasklists[contestName].lastestUpdate = Date.now();
      }
      this.tasklists[contestName].load = false;
      this.emitter.emit(contestName, data);
      return data;
    } else {
      const timeData = this.tasklists[contestName].lastestUpdate;
      if (timeData && (!cache || timeData + cacheTime <= Date.now())) {
        // キャッシュ時間外または、強制取得(cache=false)が有効のため、取得する
        this.tasklists[contestName] = { load: true };
        const data = await getTasklistPage(contestName);
        if (data.length !== 0) {
          this.tasklists[contestName].tasklists = data;
          this.tasklists[contestName].lastestUpdate = Date.now();
        }
        this.tasklists[contestName].load = false;
        // 待機中のPromiseにデータを送信
        this.emitter.emit(contestName, data);
        return data;
      } else {
        // キャッシュ時間内であるため、キャッシュデータを返す
        console.log(
          `load_TaskList:updateLastest ${dayjs(
            this.tasklists[contestName].lastestUpdate
          ).format("YYYY-MM-DDTHH:mm:ssZ[Z]")}`
        );
        const data = this.tasklists[contestName].tasklists;
        if (data) {
          return data;
        } else {
          // キャッシュ時間内なので、必ず存在する。例外処理
          return [];
        }
      }
    }
  }
  /**
   * 問題一覧のキャッシュを初期化する
   */
  resetTaskListCache = () => {
    this.tasklists = {};
  };
  /**
   * contestNameとTaskScreenNameからAssignmentNameを取得する
   */
  async getAssignmentName(
    conName: contestName,
    taskscName: taskScreenName
  ): Promise<string | "-"> {
    const contesttaskListAll = await this.getTaskList(true, conName);
    const selectedtask = contesttaskListAll.find(
      (e) => e.taskScreenName === taskscName
    );
    if (selectedtask) {
      return selectedtask.AssignmentName;
    } else {
      return "-";
    }
  }
}
export const TaskListApi = new TaskList();
/**
 * 問題の一覧を取得
 */
export async function getTasklistPage(
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
