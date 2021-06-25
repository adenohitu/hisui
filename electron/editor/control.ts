// taskcontを管理するApi
import { getDefaultContestID } from "../data/contestdata";
import { hisuiEvent } from "../event/event";
import { languagetype } from "../file/extension";
import { taskcont } from "./taskcont";

/**
 * 全てのtaskcontを管理するAPI
 */
class taskControl {
  taskAll: { [id: string]: taskcont };
  // id=TaskScreenName|contestname
  nowTop: string | null;
  DefaultContestID: string | null;
  constructor() {
    this.nowTop = null;
    this.taskAll = {};
    this.DefaultContestID = null;
    this.runDefaultContestID();
    this.eventSetup();
  }
  /**
   * DefaultContestIDのイベントを受け取るセットアップ
   */
  eventSetup() {
    hisuiEvent.on("DefaultContestID-change", (DefaultContestID) => {
      this.DefaultContestID = DefaultContestID;
    });
  }
  /**
   * runDefaultContestIDを取得
   *  更新された時のイベントを開始
   */
  async runDefaultContestID() {
    this.DefaultContestID = await getDefaultContestID();
  }
  /**
   * 新しいTaskインスタンスを開く
   */
  newTask(
    contestName: string,
    TaskScreenName: string,
    AssignmentName: string,
    language: languagetype
  ) {
    this.taskAll[TaskScreenName] = new taskcont(
      contestName,
      TaskScreenName,
      AssignmentName,
      language
    );
  }
  async changeTask(TaskScreenName: string) {
    // TaskViewを更新
    this.taskAll[TaskScreenName].settopTaskView();
    // editorEvent
    // editorの更新をチェック
    // editorのモデルをチェンジ
  }
}
/**
 * editorに関するIPCを設定
 */
export function editorControlIPC() {}
export const taskControlApi = new taskControl();
