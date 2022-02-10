// コンテストの時間を管理
// Dashboardの更新 コンテスト開始終了時のイベント発行
import dayjs, { Dayjs } from "dayjs";
import { dashboardapi } from "../browserview/dashboardview";
import { contestDataApi } from "../data/contestdata";

import { hisuiEvent } from "../event/event";
import { ipcMainManager } from "../ipc/ipc";
export interface timeData {
  status: string;
  time: number;
}

let clockFunction: any = null;

export class timer {
  nowContestID: string | null;
  starttime: Dayjs | undefined;
  endtime: Dayjs | undefined;
  timerData: timeData;
  constructor() {
    this.nowContestID = null;
    this.starttime = undefined;
    this.endtime = undefined;
    this.timerData = { status: "", time: -1 };
  }
  // コンテストの時間情報を更新する
  async setup() {
    this.nowContestID = contestDataApi.getDefaultContestID();
    const getdate = await contestDataApi.getContestDate();
    if (getdate !== "error") {
      this.starttime = dayjs(getdate.start_time);
      this.endtime = dayjs(getdate.end_time);
    }
  }
  // 1秒毎に実行する
  updateContestTime() {
    const now = dayjs();
    const nowUnix = now.unix();
    // 時間をチェックして開始・終了タイミングならイベントを呼び出す
    if (this.starttime?.unix() === nowUnix && this.nowContestID !== undefined) {
      // コンテスト開始イベントを実行
      hisuiEvent.emit("contest-start");
      ipcMainManager.send("LISTENER_CONTEST_START", this.nowContestID);
    }
    if (this.endtime?.unix() === nowUnix && this.nowContestID !== undefined) {
      // コンテスト終了イベントを実行
      hisuiEvent.emit("contest-end");
    }
    // timerDataを更新
    if (this.starttime !== undefined && this.endtime !== undefined) {
      if (now.isBefore(this.starttime)) {
        this.timerData = {
          status: "開始まで",
          time: this.starttime?.diff(now),
        };
      } else if (now.isBefore(this.endtime)) {
        this.timerData = {
          status: "残り時間",
          time: this.endtime?.diff(now),
        };
      } else {
        this.timerData = {
          status: "コンテストは終了しました",
          time: -1,
        };
      }
    }
    dashboardapi.send("LISTENER_TIMER_TICK", this.timerData);
  }
  startTimer() {
    const nextTiming = () => 1000 - (Date.now() % 1000);
    // 再帰でループ
    clockFunction = setTimeout(function main() {
      // 1秒毎に実行
      // timerApiを外部から読み込む
      timerApi.updateContestTime();
      clockFunction = setTimeout(main, nextTiming());
    }, nextTiming());
  }
  // タイマーを破棄
  clearTimer() {
    clearTimeout(clockFunction);
  }
}
export const timerApi = new timer();
