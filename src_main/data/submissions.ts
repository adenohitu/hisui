import { hisuiEvent } from "../event/event";
import { ipcMainManager } from "../ipc/ipc";
import { logger } from "../tool/logger/logger";
import { Atcoder } from "./atcoder";
import { contestDataApi } from "./contestdata";
import scraping_submissions_list from "./scraping/submissions";
import { scrapingSubmissionStatusData } from "./scraping/submissions-status";
import { submitStatus } from "./scraping/submit-data";
import { submissionData } from "./submissions-type";
class submissions {
  /**
   * デフォルトコンテストを保持
   */
  selectContestSubmissions: submissionData[];
  constructor() {
    this.selectContestSubmissions = [];
    this.eventSetup();
    this.ipcSetup();
  }
  async setup() {}
  /**
   * eventの設定
   */
  async eventSetup() {
    /**
     * 提出を監視
     */
    hisuiEvent.on("submit-status-start", (m: submitStatus) => {
      logger.info(
        `SubmitStatusMessage-start:${JSON.stringify(m.status, null, 2)}`,
        "submissionsAPI"
      );
      ipcMainManager.send("SEND_SUBMIT_START_NOTIFICARION", m);
    });
    hisuiEvent.on("submit-status", (m: submitStatus) => {
      logger.info(
        `SubmitStatusMessage:${JSON.stringify(m.status, null, 2)}`,
        "submissionsAPI"
      );
      ipcMainManager.send("SEND_SUBMIT_STATUS", m);
    });
    hisuiEvent.on("submit-status-finish", (m: submitStatus) => {
      logger.info(
        `SubmitStatusMessage_finishJudge:${JSON.stringify(m.status, null, 2)}`,
        "submissionsAPI"
      );
      ipcMainManager.send("SEND_SUBMIT_STATUS", m);
    });
  }
  /**
   * submissionsページに問い合わせて提出一覧を更新する
   */
  async updateSubmissions() {
    const nowDefaultContest = contestDataApi.getDefaultContestID();
    this.selectContestSubmissions = await this.getSubmissionMe(
      nowDefaultContest
    );
    this.checkInterval(this.selectContestSubmissions);
    // viewに取得したデータを送信
    ipcMainManager.send(
      "LISTENER_RETUEN_SUBMISSIONS",
      this.selectContestSubmissions
    );
  }

  /**
   * 自分の提出を取得
   * 一回のみ Intervalについて何も動作なし
   * contestIDを指定しない場合デフォルトのコンテストが使用される
   * taskScreenNameを指定すると取得時に検索クエリを追加する
   */
  async getSubmissionMe(
    contestID: string = contestDataApi.getDefaultContestID(),
    taskScreenName?: string
  ): Promise<submissionData[]> {
    logger.info("run get_submissions_me", "submissionsAPI");
    // taskScreenNameがある場合クエリ付きのURLにする
    const standings_url =
      (taskScreenName &&
        `https://atcoder.jp/contests/${contestID}/submissions/me?f.Task=${taskScreenName}&f.LanguageName=&f.Status=&f.User=`) ||
      `https://atcoder.jp/contests/${contestID}/submissions/me`;
    //
    const responce = await Atcoder.axiosInstance.get(standings_url, {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status < 500;
      },
    });
    if (responce.status !== 302) {
      //提出ページが公開されていない場合は"ready"を返す
      if (responce.status !== 404) {
        const data_after = await scraping_submissions_list(
          responce.data,
          contestID
        );
        logger.info("end get_submissions_me", "submissionsAPI");
        return data_after;
      } else {
        logger.info("SubmissionsPage is not ready", "submissionsAPI");
        return [];
      }
    } else {
      logger.info("Need to Login", "submissionsAPI");
      return [];
    }
  }
  ipcSetup() {}
  /**
   * ジャッジ中のものがある場合、Intervalを取った後もう一度リクエスト
   */
  private async checkInterval(data: submissionData[]) {
    const getindex = data.find((element) => element.waiting_judge === true);
    if (getindex !== undefined) {
      var serf = this;
      setTimeout(() => {
        serf.updateSubmissions();
      }, 3000);
    }
  }
  /**
   * 提出が完了した直後に呼び出され、提出したものの状態を監視する
   */
  async submitCheck(contestID: string) {
    // --ここからチェックに必要な処理を定義--
    const getSubmitStatus = async (
      submissionData: submissionData
    ): Promise<submitStatus> => {
      // const submissionStatusUrl = `https://atcoder.jp/contests/${submissionData.contestName}/submissions/${submissionData.submit_id}/status/json`;
      const submissionStatusUrl = `https://atcoder.jp/contests/${submissionData.contestName}/submissions/me/status/json?reload=true&sids[]=${submissionData.submit_id}`;
      const responce = await Atcoder.axiosInstance.get(submissionStatusUrl, {
        maxRedirects: 0,
        validateStatus: function (status) {
          return status < 500;
        },
      });
      if (responce.status !== 302) {
        //提出ページが公開されていない場合は"ready"を返す
        if (responce.status !== 404) {
          const data_after = await scrapingSubmissionStatusData(
            responce.data,
            submissionData
          );
          hisuiEvent.emit("submit-status", data_after);
          logger.info("end get_SubmitStatus", "submissionsAPI");
          return data_after;
        } else {
          logger.info("SubmitStatus is not ready", "submissionsAPI");
          return { submissionData, status: "ER", labelColor: "default" };
        }
      } else {
        logger.info("Need to Login", "submissionsAPI");
        return { submissionData, status: "ER", labelColor: "default" };
      }
    };

    /**
     * 定義
     * Intervalがなくなるまで、結果を受信し続けて、Promiseで返す
     */
    const getSubmitStatus_WaitInterval = async (
      submissionData: submissionData,
      Interval?: number
    ): Promise<submitStatus> => {
      if (Interval) {
        // 非同期待機
        await new Promise((resolve) => setTimeout(resolve, Interval));
        // Status情報取得
        const getData = await getSubmitStatus(submissionData);
        // Intervalの有無をチェック
        if (getData.Interval) {
          return await getSubmitStatus_WaitInterval(
            submissionData,
            getData.Interval
          );
        } else {
          // Intervalがないので結果を返す
          hisuiEvent.emit("submit-status-finish", getData);
          return getData;
        }
      } else {
        // 初回実行される
        const getData = await getSubmitStatus(submissionData);
        // Intervalの有無をチェック
        if (getData.Interval) {
          hisuiEvent.emit("submit-status-start", getData);
          return await getSubmitStatus_WaitInterval(
            submissionData,
            getData.Interval
          );
        } else {
          hisuiEvent.emit("submit-status-finish", getData);
          // Intervalがないので結果を返す
          return getData;
        }
      }
    };

    // --ここからチェックに関する処理--
    // getSubmitStatus_WaitIntervalを実際に実行
    const submissionList = await this.getSubmissionMe(contestID);
    if (submissionList[0]) {
      // 多分１番目のものが直前に提出したもの
      const preSubmitData = submissionList[0];
      const waitdata = await getSubmitStatus_WaitInterval(preSubmitData);
      return waitdata;
    } else {
      logger.info("Couldnt FindSubmit-id", "submissionsAPI");
      return {};
    }
  }
}
export const submissionsApi = new submissions();
