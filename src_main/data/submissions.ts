import { hisuiEvent } from "../event/event";
import { ipcMainManager } from "../ipc/ipc";
import { logger } from "../tool/logger/logger";
import { Atcoder } from "./atcoder";
import { contestDataApi } from "./contestdata";
import scraping_submissions_list, {
  submissionData,
} from "./scraping/submissions";
import { scraping_submitData, submitStatus } from "./scraping/submit-data";
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
    hisuiEvent.on("DefaultContestID-change", (arg) => {
      // this.nowDefaultContest = arg;
      this.updateSubmissions();
    });
    hisuiEvent.on("submit", () => {
      this.updateSubmissions();
    });
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
    if (this.getSubmissionMe) {
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
  }

  /**
   * 得点情報を取得
   */
  async getContestScore(
    contestID: string = contestDataApi.getDefaultContestID()
  ): Promise<any> {
    console.log("run get_Score");
    const standings_url = `https://atcoder.jp/contests/${contestID}/score/json`;
    const responce = await Atcoder.axiosInstance.get(standings_url, {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status < 500;
      },
    });
    if (responce.status !== 302) {
      //そもそも予定されていないコンテストをSetContestIDに設定することはできないので404対策は付けない
      if (responce.data !== `"error"`) {
        //atcoderの謎仕様に注意
        //予定されているコンテストの場合302ではなく`"error"`（ダブルクォーテーションがいる）を返す
        return responce.data;
      } else {
        console.log("ready");
        return [];
      }
    } else {
      console.log("must login");
      return [];
    }
  }

  /**
   * 自分の提出を取得
   * 一回のみ Intervalについて何も動作なし
   */
  async getSubmissionMe(
    contestID: string = contestDataApi.getDefaultContestID()
  ) {
    logger.info("run get_submissions_me", "submissionsAPI");
    const standings_url = `https://atcoder.jp/contests/${contestID}/submissions/me`;
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
  ipcSetup() {
    // submissionsを更新する
    ipcMainManager.on("RUN_UPDATE_SUBMISSIONS", () => {
      this.updateSubmissions();
    });
  }
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
    async function getSubmitStatus(
      submissionData: submissionData
    ): Promise<submitStatus> {
      const submissionStatusUrl = `https://atcoder.jp/contests/${submissionData.contestName}/submissions/${submissionData.submit_id}/status/json`;
      const responce = await Atcoder.axiosInstance.get(submissionStatusUrl, {
        maxRedirects: 0,
        validateStatus: function (status) {
          return status < 500;
        },
      });
      if (responce.status !== 302) {
        //提出ページが公開されていない場合は"ready"を返す
        if (responce.status !== 404) {
          const data_after = await scraping_submitData(
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
    }
    /**
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
