import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import dayjs from "dayjs";
import { hisuiEvent } from "../event/event";
import {
  loadCacheAtCoderSubmissions,
  loadCachePloblemsSubmissions,
  saveCacheAtCoderSubmissions,
  saveCachePloblemsSubmissions,
} from "../file/submission-fs";
import { ipcMainManager } from "../ipc/ipc";
import { logger } from "../tool/logger/logger";
import { Atcoder } from "./atcoder";
import {
  mergedProblemType,
  SubmissionAtCoderProblems,
} from "./interface/atcoder-ploblems";
import { submitStatus } from "./scraping/submit-data";
import { submissionsApi } from "./submissions";
import { submissionData } from "./submissions-type";
const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec));
// AxiosInstanceを作成
const ploblemAxiosInstance: AxiosInstance = axios.create({
  timeout: 30000,
  headers: {
    "Accept-Encoding": "gzip",
  },
});
ploblemAxiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
  const url = `${config.url}`;
  logger.info(
    `${logger.colors.blue}start${logger.colors.reset} request:Url=${url} Method=${config.method}`,
    "axios-Ploblem"
  );
  return config;
});
ploblemAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const status = response.status;
    const url = response?.config.url;
    logger.info(
      `request ${logger.colors.green}success${logger.colors.reset}:Url=${url} Status=${status}`,
      "axios-Ploblem"
    );
    return response;
  },
  (error: AxiosError) => {
    logger.error(
      `request ${logger.colors.red}error${logger.colors.reset}:Url="${error.config.url}" message=${error.message}`,
      "axios-Ploblem"
    );
  }
);
/**
 * 提出データを管理するクラス
 */
class submissionDB {
  // アプリ終了時に保持する
  cacheAtCoderSubmissionsMeAllList: submissionData[];
  cachePloblemSubmissionMeAllList: submissionData[];
  submissionsMeAllList: submissionData[];
  // 保持しない
  cacheMergedProblem: mergedProblemType[] | null;
  submissionsCount: number | null;

  constructor() {
    this.cacheAtCoderSubmissionsMeAllList = [];
    this.cachePloblemSubmissionMeAllList = [];
    this.submissionsMeAllList = [];

    this.cacheMergedProblem = null;
    this.submissionsCount = null;
  }
  /**
   * デフォルトのコンテストの提出一覧から取得する
   * この段階ではジャッジ中のものがあっても気にせずにAllListに保存する
   */
  async updateDefaultContestSubmissionList() {
    const list = await submissionsApi.getSubmissionMe();
    this.updateAllList(list);
    // キャッシュにデータを保持
    list.forEach((ele) => {
      const datafindIndex = this.cacheAtCoderSubmissionsMeAllList.findIndex(
        (a) => a.submit_id === ele.submit_id
      );
      if (datafindIndex === -1) {
        this.cacheAtCoderSubmissionsMeAllList =
          this.cacheAtCoderSubmissionsMeAllList.concat(ele);
      } else {
        this.cacheAtCoderSubmissionsMeAllList[datafindIndex] = ele;
      }
    });
    this.cacheAtCoderSubmissionsMeAllList = this.sortAllList(
      this.cacheAtCoderSubmissionsMeAllList
    );
    this.saveCacheAtCoderSubmissions();
  }

  /**
   * 一つの問題のSubmissionsから取得する
   * TaskContが開かれた時に実行
   */
  async updateOneTaskSubmissionList(
    contest_id: string,
    taskScreenName: string
  ) {
    const list = await submissionsApi.getSubmissionMe(
      contest_id,
      taskScreenName
    );
    this.updateAllList(list);
    // キャッシュにデータを保持
    list.forEach((ele) => {
      const datafindIndex = this.cacheAtCoderSubmissionsMeAllList.findIndex(
        (a) => a.submit_id === ele.submit_id
      );
      if (datafindIndex === -1) {
        this.cacheAtCoderSubmissionsMeAllList =
          this.cacheAtCoderSubmissionsMeAllList.concat(ele);
      } else {
        this.cacheAtCoderSubmissionsMeAllList[datafindIndex] = ele;
      }
    });
    this.cacheAtCoderSubmissionsMeAllList = this.sortAllList(
      this.cacheAtCoderSubmissionsMeAllList
    );
    this.saveCacheAtCoderSubmissions();
  }
  /**
   * PloblemのSubmissionListから取得する
   * 過去の提出一覧を取得する
   * 500件ずつしか取得できないため、複数回に分けて取得する
   * 古いものから新しいものに向かって取得する
   */
  async updatePloblemSubmissionMeAllFromLastestSubmission() {
    if (Atcoder.checkLogin()) {
      if (this.cachePloblemSubmissionMeAllList.length === 0) {
        ipcMainManager.send(
          "SEND_NOTIFICARION",
          "過去の提出を取得しています。\nこれには時間がかかる可能性があります"
        );
      }
      const userID = Atcoder.getUsername();
      if (this.submissionsCount === null) {
        // AtCoderPloblemsで取得できるSubmissionStatusの数を取得
        const getSubmissionsCount = await ploblemAxiosInstance.get(
          `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submission_count?user=${userID}&from_second=0&to_second=${dayjs(
            Date.now()
          ).unix()}`
        );
        if (getSubmissionsCount.status === 200) {
          this.submissionsCount = getSubmissionsCount.data.count;
        }
      }
      if (this.submissionsCount !== null) {
        if (
          this.cachePloblemSubmissionMeAllList.length < this.submissionsCount
        ) {
          // キャッシュ数が取得した提出数よりも少なかったら実行
          if (this.cachePloblemSubmissionMeAllList.length === 0) {
            // 古いものからキャッシュする
            const update = await this.updatePloblemSubmissionMeAll(
              "0000000000"
            );
            if (update?.length !== 1) {
              await sleep(5000);
              this.updatePloblemSubmissionMeAllFromLastestSubmission();
            }
          } else {
            const update = await this.updatePloblemSubmissionMeAll(
              `${dayjs(this.cachePloblemSubmissionMeAllList[0].created).unix()}`
            );
            if (update?.length !== 1) {
              await sleep(5000);
              this.updatePloblemSubmissionMeAllFromLastestSubmission();
            }
          }
        } else {
          logger.info(
            `AtCoderPloblemCache is sucessesful count=${this.submissionsCount}`,
            "submissionDBAPI"
          );
        }
      }
    } else {
      logger.info(`need to login`, "submissionDBAPI");
    }
  }

  /**
   * PloblemのSubmissionListから取得する
   */
  private async updatePloblemSubmissionMeAll(from_second: string) {
    if (Atcoder.checkLogin()) {
      if (this.cacheMergedProblem === null) {
        const mergedProblemReq = await ploblemAxiosInstance.get(
          "https://kenkoooo.com/atcoder/resources/merged-problems.json"
        );
        if (mergedProblemReq.status === 200) {
          this.cacheMergedProblem = mergedProblemReq.data;
        }
      }
      const userID = Atcoder.getUsername();

      if (userID && this.cacheMergedProblem !== null) {
        const mergedProblem = this.cacheMergedProblem;
        const url = `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${userID}&from_second=${from_second}`;
        // 連続リクエストを回避
        await sleep(1000);
        const reqdata = await ploblemAxiosInstance.get(url);

        if (reqdata.status === 200) {
          const listAtProblem: SubmissionAtCoderProblems[] = reqdata.data;

          const list: submissionData[] = listAtProblem.map<submissionData>(
            (ele) => {
              const plobleminfo = mergedProblem.find(
                (arg) => arg.id === ele.problem_id
              );
              return {
                waiting_judge: false,
                created: dayjs.unix(ele.epoch_second).toISOString(),
                contestName: ele.contest_id,
                taskScreenName: ele.problem_id,
                taskname_render: (plobleminfo && plobleminfo.title) || null,
                task_url: `/contests/${ele.contest_id}/tasks/${ele.problem_id}`,
                user: ele.user_id,
                language: ele.language,
                score: String(ele.point),
                source_length: `${ele.length} Byte`,
                result: ele.result,
                result_explanation: null,
                time_consumption: `${ele.execution_time} ms`,
                memory_consumption: "",
                submit_id: String(ele.id),
                submit_url: `/contests/${ele.contest_id}/submissions/${ele.id}`,
              };
            }
          );
          this.updateAllList(list, false);
          // キャッシュにデータを保持
          list.forEach((ele) => {
            const datafindIndex =
              this.cachePloblemSubmissionMeAllList.findIndex(
                (a) => a.submit_id === ele.submit_id
              );
            if (datafindIndex === -1) {
              this.cachePloblemSubmissionMeAllList =
                this.cachePloblemSubmissionMeAllList.concat(ele);
            } else {
              this.cachePloblemSubmissionMeAllList[datafindIndex] = ele;
            }
          });
          this.cachePloblemSubmissionMeAllList = this.sortAllList(
            this.cachePloblemSubmissionMeAllList
          );
          this.saveCachePloblemsSubmissions();
          return list;
        }
      }
    } else {
      logger.info(`need to login`, "submissionDBAPI");
    }
  }

  /**
   * submitCheckで発生するイベントから、リストを更新する
   * checkIntervalからのイベントを受け取り、リストを更新する
   */
  async setupEvent() {
    // キャッシュの読み込み
    this.loadCachePloblemsSubmissions();
    this.loadCacheAtCoderSubmissions();
    // submissionsを更新する
    ipcMainManager.on("RUN_UPDATE_SUBMISSIONS", () => {
      this.updateDefaultContestSubmissionList();
      this.updatePloblemSubmissionMeAllFromLastestSubmission();
    });
    hisuiEvent.on("DefaultContestID-change", (arg) => {
      this.updateDefaultContestSubmissionList();
    });

    /**
     * 提出を監視
     */
    hisuiEvent.on("submit-status-start", (m: submitStatus) => {
      this.updateAllList([m.submissionData]);
    });
    hisuiEvent.on("submit-status", (m: submitStatus) => {
      this.updateAllList([m.submissionData]);
    });
    hisuiEvent.on("submit-status-finish", (m: submitStatus) => {
      this.updateAllList([m.submissionData]);
    });
  }

  /**
   * submissionsMeAllListに追加する
   * 既にある場合はデータを更新
   * 存在しない場合、追加する
   * また、提出順番にソートする
   * primaryをFalseにするともし既にデータが存在する場合更新しない
   */
  async updateAllList(dataList: submissionData[], primary: boolean = true) {
    dataList.forEach((ele) => {
      const datafindIndex = this.submissionsMeAllList.findIndex(
        (a) => a.submit_id === ele.submit_id
      );
      if (datafindIndex === -1) {
        this.submissionsMeAllList = this.submissionsMeAllList.concat(ele);
      } else {
        if (primary) {
          this.submissionsMeAllList[datafindIndex] = ele;
        }
      }
    });

    this.submissionsMeAllList = this.sortAllList(this.submissionsMeAllList);
    this.sendSubmissionsList();
  }

  /**
   * リストを提出時間順にソートする
   */
  private sortAllList(currentList: submissionData[]) {
    return currentList
      .slice()
      .sort((a, b) => {
        return dayjs(a.created).unix() > dayjs(b.created).unix() ? 1 : -1;
      })
      .reverse();
  }
  /**
   * レンダーに提出リストを送信
   */
  private sendSubmissionsList() {
    ipcMainManager.send(
      "LISTENER_RETUEN_SUBMISSIONS",
      this.submissionsMeAllList
    );
  }
  /**
   * キャッシュ保持を実行
   */
  private async saveCacheAtCoderSubmissions() {
    const datatoJson = JSON.stringify(this.cacheAtCoderSubmissionsMeAllList);
    saveCacheAtCoderSubmissions(datatoJson);
  }
  private async saveCachePloblemsSubmissions() {
    const datatoJson = JSON.stringify(this.cachePloblemSubmissionMeAllList);
    saveCachePloblemsSubmissions(datatoJson);
  }
  /**
   * キャッシュデータを復元
   */
  private async loadCacheAtCoderSubmissions() {
    const loadData = await loadCacheAtCoderSubmissions();
    if (loadData.data !== "") {
      const parseData = JSON.parse(loadData.data);
      this.updateAllList(parseData);
    }
  }
  private async loadCachePloblemsSubmissions() {
    const loadData = await loadCachePloblemsSubmissions();
    if (loadData.data !== "") {
      const parseData = JSON.parse(loadData.data);
      this.cachePloblemSubmissionMeAllList = parseData;
      this.updateAllList(parseData);
    }
  }
}
export const submissionDBApi = new submissionDB();
