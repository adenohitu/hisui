// taskcontを管理するApi
import { codeTestInfo } from "../data/casetester/runtest_atcoder";
import { contestDataApi } from "../data/contestdata";
import { TaskListApi } from "../data/task";
import { hisuiEvent } from "../event/event";
import { languagetype } from "../file/extension";
import { hisuiEditorChangeModelContentObject } from "../interfaces";
import { ipcMainManager } from "../ipc/ipc";
import { store } from "../save/save";
import { editorStatus, taskcont } from "./taskcont";
export interface taskContStatusType {
  contestName: string;
  taskScreenName: string;
  AssignmentName: string | null;
  // 指定がない場合、デフォルトの言語を使用
  language?: languagetype;
}
export interface taskNowStatus extends taskContStatusType {
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
  judgeMode: "online" | "local" | string = "online";

  constructor() {
    this.nowTop = null;
    this.taskAll = {};
    this.DefaultContestID = null;
    this.runDefaultContestID();
    this.eventSetup();
    this.setupIPCMain();
    this.judgeMode = store.get("judgeMode", "online");
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
   * 指定したKeyのTaskContを閉じる
   */
  async closeTaskCont(taskScreenName: string) {
    await this.taskAll[taskScreenName].close();
    delete this.taskAll[taskScreenName];
    ipcMainManager.send("LISTENER_CHANGE_TASK_CONT_STATUS");
    // TaskAllにTaskContが一つでも存在する場合,NowTopを更新する
    const taskAllKey = Object.keys(this.taskAll);
    if (taskAllKey.length !== 0) {
      this.changeTask(taskAllKey[0]);
    } else {
      // editorStatus を空にする
      const result: editorStatus = {
        contestName: "",
        TaskScreenName: "",
        AssignmentName: "",
        language: "",
        submitLanguage: null,
        taskcodeByte: "-",
      };
      ipcMainManager.send("LISTENER_EDITOR_STATUS", result);
    }
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
    taskScreenName: string,
    // 指定がない場合、デフォルトの言語を使用
    language?: languagetype
  ) {
    if (this.taskAll[taskScreenName] !== undefined) {
      this.changeTask(taskScreenName);
    } else {
      // AssignmentNameで問題の存在を確認する
      const assignmentName = await TaskListApi.getAssignmentName(
        contestName,
        taskScreenName
      );
      if (assignmentName !== "-") {
        //taskcontを作成
        if (language === undefined) {
          const uselang = await store.get("defaultLanguage", "cpp");
          // const uselang = "cpp";
          this.taskAll[taskScreenName] = new taskcont(
            contestName,
            taskScreenName,
            uselang
          );
        } else {
          this.taskAll[taskScreenName] = new taskcont(
            contestName,
            taskScreenName,
            language
          );
        }
        /**
         * 初回ロードはTopに自動的になる
         * モデルが作られる前にchangeTaskを実行することができない
         */
        this.nowTop = taskScreenName;
        ipcMainManager.send("LISTENER_CHANGE_TASK_CONT_STATUS");
      } else {
        // 問題の存在を確認できない
        console.log(`CantFindTask:${taskScreenName}`);
      }
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
    this.taskAll[TaskScreenName].resetTaskView();
    this.nowTop = TaskScreenName;
    // editorEvent
    // editorの更新をチェック
    // editorのモデルをチェンジ
    ipcMainManager.send("SET_EDITOR_MODEL", TaskScreenName);
    this.taskAll[TaskScreenName].sendValueStatus();
  }
  /**
   * 今のページをリロード
   */
  nowTaskViewReload() {
    if (this.nowTop) {
      this.taskAll[this.nowTop].reloadTaskView();
    }
  }
  getTaskStatusList(): taskNowStatus[] {
    const statusList = Object.keys(this.taskAll).map((key) => {
      const topStatus = (this.nowTop === key && true) || false;
      return {
        contestName: this.taskAll[key].contestName,
        taskScreenName: this.taskAll[key].taskScreenName,
        AssignmentName: this.taskAll[key].AssignmentName,
        language: this.taskAll[key].language,
        nowtop: topStatus,
      };
    });
    return statusList;
  }
  changeJudgeMode(mode: string) {
    store.set("judgeMode", mode);
    this.judgeMode = mode;
  }
  /**
   * editor側からイベントを受け取る
   */
  setupIPCMain() {
    // taskcontを作成する
    ipcMainManager.on("CREATE_TASKCONT", (event, arg: taskContStatusType) => {
      this.createNewTask(
        arg.contestName,
        arg.taskScreenName,
        // 基本undefined
        arg.language
      );
    });
    ipcMainManager.on("CLOSE_TASKCONT", (e, taskScreenName: string) => {
      this.closeTaskCont(taskScreenName);
    });
    ipcMainManager.on("RUN_SAVE_TASKCONT", (event, id: string) => {
      this.taskAll[id].save();
    });
    // Editorの更新イベントを受け取る
    ipcMainManager.on(
      "EDITOR_MODEL_CONTENTS_CHANGE",
      (e, arg: hisuiEditorChangeModelContentObject) => {
        if (this.nowTop) {
          this.taskAll[arg.nowmodelId].changeEvent(arg);
        }
      }
    );
    ipcMainManager.on("RUN_NOWTASKVIEW_RELOAD", () => {
      this.nowTaskViewReload();
    });
    // ジャッジモードを取得
    ipcMainManager.handle("GET_CODETEST_MODE", async () => {
      return this.judgeMode;
    });
    // ジャッジモードを変更
    ipcMainManager.on("SET_CODETEST_MODE", async (e, arg: string) => {
      this.changeJudgeMode(arg);
    });

    // dafaultlangageに関するIPC
    // デフォルトの言語を変更
    ipcMainManager.on(
      "SET_DEFAULT_LANGUAGE",
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
    // 提出言語を保存する
    ipcMainManager.on("SET_NOWCONT_SUBMIT_LANGUAGE", (e, arg) => {
      store.set("submitLanguage", arg);
      if (this.nowTop !== null) {
        this.taskAll[this.nowTop].submitLanguageChange(arg);
      }
    });
    // 現在一番上のTaskContの言語を取得
    ipcMainManager.handle("GET_NOWTOP_EDITOR_LANGUAGE", async () => {
      if (this.nowTop !== null) {
        const dafaultlanguage = await this.taskAll[this.nowTop].language;
        return dafaultlanguage;
      } else {
        const dafaultlanguage = await store.get("defaultLanguage", "cpp");
        return dafaultlanguage;
      }
    });
    // 提出する
    ipcMainManager.on("RUN_SUBMIT_NOWTOP", (event) => {
      if (this.nowTop !== null) {
        this.taskAll[this.nowTop].submit();
      }
    });
    // コードテストを実行
    ipcMainManager.on(
      "RUN_CODETEST_NOWTOP",
      async (event, infoData: codeTestInfo) => {
        if (this.nowTop !== null) {
          const result = await this.taskAll[this.nowTop].codeTest(
            infoData,
            this.judgeMode
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
