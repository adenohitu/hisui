// taskcontを管理するApi
import { ipcMain } from "electron";
import { editorViewapi } from "../browserview/editorview";
import { contestDataApi } from "../data/contestdata";
import { hisuiEvent } from "../event/event";
import { languagetype } from "../file/extension";
import { ipcMainManager } from "../ipc/ipc";
import { store } from "../save/save";
import { taskcont } from "./taskcont";
export interface taskContStatusType {
  contestName: string;
  TaskScreenName: string;
  AssignmentName: string;
  // 指定がない場合、デフォルトの言語を使用
  language?: languagetype;
}
export interface taskStatus extends taskContStatusType {
  nowtop?: boolean;
}
/**
 * 全てのtaskcontを管理するAPI
 */
class taskControl {
  taskAll: { [id: string]: taskcont };
  // id:TaskScreenName
  nowTop: string | null;
  DefaultContestID: string | null;
  constructor() {
    this.nowTop = null;
    this.taskAll = {};
    this.DefaultContestID = null;
    this.runDefaultContestID();
    this.eventSetup();
    this.setupIPCMain();
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
   * taskControlを初期化
   */
  close() {
    this.removeAllTaskCont();
  }
  /**
   * TaskContを全て削除する
   */
  async removeAllTaskCont() {
    Object.keys(this.taskAll).forEach((key) => {
      this.taskAll[key].close();
    });
    this.nowTop = null;
    this.taskAll = {};
  }
  /**
   * runDefaultContestIDを取得
   *  更新された時のイベントを開始
   */
  async runDefaultContestID() {
    this.DefaultContestID = contestDataApi.getDefaultContestID();
  }
  /**
   * 新しいTaskインスタンスを開く
   * すでに作成されている場合、Topに設定する
   */
  async createNewTask(
    contestName: string,
    TaskScreenName: string,
    AssignmentName: string,
    // 指定がない場合、デフォルトの言語を使用
    language?: languagetype
  ) {
    if (this.taskAll[TaskScreenName] !== undefined) {
      this.changeTask(TaskScreenName);
    } else {
      //taskcontを作成
      if (language === undefined) {
        const uselang = await store.get("defaultLanguage", "cpp");
        // const uselang = "cpp";
        this.taskAll[TaskScreenName] = new taskcont(
          contestName,
          TaskScreenName,
          AssignmentName,
          uselang
        );
      } else {
        this.taskAll[TaskScreenName] = new taskcont(
          contestName,
          TaskScreenName,
          AssignmentName,
          language
        );
      }
      /**
       * 初回ロードはTopに自動的になる
       * モデルが作られる前にchangeTaskを実行することができない
       */
      this.nowTop = TaskScreenName;
    }
  }
  /**
   * 一番上にあるTaskにセーブイベントを発生させる
   */
  saveNowTop() {
    if (this.nowTop) {
      this.taskAll[this.nowTop].save();
    }
  }

  async changeTask(TaskScreenName: string) {
    // ViewのTopの変更
    this.taskAll[TaskScreenName].settopTaskView();
    this.nowTop = TaskScreenName;
    // editorEvent
    // editorの更新をチェック
    // editorのモデルをチェンジ
    editorViewapi.view?.webContents.send("setModel", TaskScreenName);
    this.taskAll[TaskScreenName].sendValueStatus();
  }
  /**
   * TopViewのページ推移を初期状態に戻す
   */
  nowTaskViewReset() {
    if (this.nowTop) {
      this.taskAll[this.nowTop].resetTaskView();
    }
  }
  getTaskStatusList() {
    const statusList: taskStatus[] = (
      Object.keys(this.taskAll) as (keyof taskcont)[]
    ).map((key) => {
      const topStatus = (this.nowTop === key && true) || false;
      return {
        contestName: this.taskAll[key].contestName,
        TaskScreenName: this.taskAll[key].TaskScreenName,
        AssignmentName: this.taskAll[key].AssignmentName,
        language: this.taskAll[key].language,
        nowtop: topStatus,
      };
    });
    return statusList;
  }
  /**
   * editor側からイベントを受け取る
   */
  setupIPCMain() {
    // taskcontを作成する
    ipcMain.on("createTaskCont", (event, arg: taskContStatusType) => {
      this.createNewTask(
        arg.contestName,
        arg.TaskScreenName,
        arg.AssignmentName,
        // 基本undefined
        arg.language
      );
    });
    ipcMain.on("save", (event, id: string) => {
      this.taskAll[id].save();
    });
    // Editorの更新イベントを受け取る
    ipcMainManager.on("EDITOR_MODEL_CONTENTS_CHANGE", () => {
      if (this.nowTop) {
        this.taskAll[this.nowTop].changeEvent();
      }
    });
    // taskViewのURLを初期値に戻す
    ipcMain.on("nowTaskViewReset", () => {
      this.nowTaskViewReset();
    });

    // dafaultlangageに関するIPC
    // デフォルトの言語を変更
    ipcMain.on(
      "setdefaultLanguage",
      (event, language: languagetype, load: boolean) => {
        // storeに保存
        console.log(language);

        store.set("defaultLanguage", language);
        // ついでに今開いてるファイルの言語を変更
        if (this.nowTop !== null) {
          console.log(this.nowTop);

          this.taskAll[this.nowTop].languageChange(language, load);
        }
      }
    );
    ipcMain.handle("getdefaultLanguage", async (event) => {
      // console.log(Atcoder_class.axiosInstance);
      const dafaultlanguage = await store.get("defaultLanguage", "cpp");
      return dafaultlanguage;
    });
    // 提出する
    ipcMain.on("submitNowTop", (event) => {
      if (this.nowTop !== null) {
        this.taskAll[this.nowTop].submit();
      }
    });
    // コードテストを実行
    ipcMain.on(
      "runcodeTestNowTop",
      async (event, samplecase: string, answer: string | null = null) => {
        if (this.nowTop !== null) {
          const result = await this.taskAll[this.nowTop].codeTest(
            samplecase,
            answer
          );
          console.log(`codeTestStatus:${result}`);
        }
      }
    );
    ipcMainManager.handle("GET_NOWTOP_TASK_SAMPLECASE", async () => {
      if (this.nowTop !== null) {
        const result = await this.taskAll[this.nowTop].getAllSamplecase();
        return result;
      } else {
        return [];
      }
    });
    ipcMainManager.handle("GET_TASK_CONT_STATUS_ALL", async (event) => {
      const result = this.getTaskStatusList();
      return result;
    });
  }
}

export const taskControlApi = new taskControl();
