import { ipcMain } from "electron";
import { dashboardapi } from "../browserview/dashboardview";
import { editorViewapi } from "../browserview/editorview";
import { hisuiEvent } from "../event/event";
import { Atcoder } from "./atcoder";
import { contestDataApi } from "./contestdata";
import scraping_submissions_list, {
  submissionData,
} from "./scraping/submissions";
class submissions {
  /**
   * デフォルトコンテストを保持
   */
  nowDefaultContest: string | null;
  selectContestSubmissions: submissionData[];
  timer: NodeJS.Timer | null;
  constructor() {
    this.nowDefaultContest = null;
    this.selectContestSubmissions = [];
    this.timer = null;
    this.eventSetup();
    this.ipcSetup();
  }
  /**
   *  submissionを自動更新
   */
  async startTimer() {
    this.timer = setInterval(this.updateSubmissions, 60000);
  }
  async setup() {
    this.nowDefaultContest = contestDataApi.DefaultContestID;
  }
  /**
   * eventの設定
   */
  async eventSetup() {
    hisuiEvent.on("DefaultContestID-change", (arg) => {
      this.nowDefaultContest = arg;
    });
  }
  /**
   * submissionsページに問い合わせて提出一覧を更新する
   */
  async updateSubmissions() {
    if (this.nowDefaultContest !== null) {
      this.selectContestSubmissions = await this.getSubmissionMe(
        this.nowDefaultContest
      );
      dashboardapi.dashboardView?.webContents.send(
        "submissionsReturn",
        this.selectContestSubmissions
      );
      editorViewapi.editorView?.webContents.send(
        "submissionsReturn",
        this.selectContestSubmissions
      );
    }
  }

  /**
   * 得点情報を取得
   */
  async getContestScore(
    contestID: string = contestDataApi.DefaultContestID
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
   */
  async getSubmissionMe(contestID: string = contestDataApi.DefaultContestID) {
    console.log("run get_submissions_me");
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
        const data_after = await scraping_submissions_list(responce.data);
        console.log("end get_submissions_me");
        return data_after;
      } else {
        console.log("ready");
        return [];
      }
    } else {
      console.log("must login");
      return [];
    }
  }
  ipcSetup() {
    // submissionsを更新する
    ipcMain.on("updateSubmissions", () => {
      this.updateSubmissions();
    });
  }
}
export const submissionsApi = new submissions();
