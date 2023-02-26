// taskcontを管理するApi
import { codeTestInfo } from "../code-test/codetest";
import { contestDataApi } from "../data/contestdata";
import { hisuiEvent } from "../event/event";
import { defaultCodeSaveFilepath, loadTaskinfo } from "../file/editor-fs";
import { languagetype } from "../file/extension";
import { serviceMgtTaskInfo } from "../file/taskinfo";
import { hisuiEditorChangeModelContentObject } from "../interfaces";
import { ipcMainManager } from "../ipc/ipc";
import { store } from "../save/save";
import { editorStatus, taskcont } from "./taskcont";
export interface taskContStatusType {
  service: string;
  // contestName
  taskGroup: string;
  // taskScreenName
  taskID: string;
}
export interface taskNowStatus extends taskContStatusType {
  nowtop?: boolean;
  margeid: string;
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
   * 問題の存在チェックは行わない
   */
  async createNewTask(
    serviceProps: serviceMgtTaskInfo,
    editorLanguage?: string
  ) {
    const margeId = `${serviceProps.service}-${serviceProps.taskGroup}-${serviceProps.taskID}`;
    if (this.taskAll[margeId] !== undefined) {
      this.changeTask(margeId);
    } else {
      // デフォルトのEditorLangを設定
      let uselang = await store.get("defaultLanguage", "cpp");
      // const uselang = "cpp";
      if (uselang === "") {
        store.set("defaultLanguage", "cpp");
        uselang = "cpp";
      }
      if (editorLanguage) {
        uselang = editorLanguage;
      }
      let taskInfo = {
        ...serviceProps,
        editorInfo: {
          languagetype: uselang,
        },
      };
      // デフォルトのディレクトリを取得
      const filepathData = defaultCodeSaveFilepath(taskInfo);

      // ディレクトリーにあるTaskInfoを読み込む
      // ロードしたものを優先する
      const loadTaskInfo = await loadTaskinfo(filepathData);
      if (loadTaskInfo) {
        taskInfo = loadTaskInfo;
      }
      this.taskAll[margeId] = new taskcont(
        taskInfo,
        filepathData.filePath,
        filepathData.fileName
      );

      /**
       * 初回ロードはTopに自動的になる
       * モデルが作られる前にchangeTaskを実行することができない
       */
      this.nowTop = margeId;
      ipcMainManager.send("LISTENER_CHANGE_TASK_CONT_STATUS");
      // 問題の提出一覧を更新
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

  async changeTask(margeId: string) {
    // ViewのTopの変更
    this.taskAll[margeId].settopTaskView();
    this.taskAll[margeId].resetTaskView();
    this.nowTop = margeId;
    // editorEvent
    // editorの更新をチェック
    // editorのモデルをチェンジ
    ipcMainManager.send("SET_EDITOR_MODEL", margeId);
    this.taskAll[margeId].sendValueStatus();
  }
  getTaskStatusList(): taskNowStatus[] {
    const statusList = Object.keys(this.taskAll).map((key) => {
      const topStatus = (this.nowTop === key && true) || false;
      const returnData: taskNowStatus = {
        service: this.taskAll[key].taskCodeInfo.service,
        taskGroup: this.taskAll[key].taskCodeInfo.taskGroup,
        taskID: this.taskAll[key].taskCodeInfo.taskID,
        margeid: `${this.taskAll[key].taskCodeInfo.service}-${this.taskAll[key].taskCodeInfo.taskGroup}-${this.taskAll[key].taskCodeInfo.taskID}`,
        nowtop: topStatus,
      };
      return returnData;
    });
    return statusList;
  }
  /**
   * 現在表示されているEditorの内容を提出する
   */
  submitNowTop() {
    if (this.nowTop !== null) {
      this.taskAll[this.nowTop].submit();
    }
  }

  /**
   * editor側からイベントを受け取る
   */
  setupIPCMain() {
    // taskcontを作成する

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
    // dafaultlangageに関するIPC
    // デフォルトの言語を変更
    // 新規TaskCont作成時に適応される
    ipcMainManager.on(
      "SET_DEFAULT_LANGUAGE",
      (event, language: languagetype, load: boolean) => {
        store.set("defaultLanguage", (language !== "" && language) || "cpp");
      }
    );
    /**
     * 選択されているTaskContの言語を更新する
     * TaskContを再生成する
     */
    ipcMainManager.on(
      "SET_NOWTOP_EDITOR_LANGUAGE",
      (e, language: languagetype, load: boolean) => {
        if (this.nowTop !== null) {
          const nowtopTaskInfo = this.taskAll[this.nowTop].taskCodeInfo;
          this.closeTaskCont(this.nowTop).then(() => {
            this.createNewTask(nowtopTaskInfo, language);
          });
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
        const dafaultlanguage = await this.taskAll[this.nowTop].taskCodeInfo
          .editorInfo.languagetype;
        return dafaultlanguage;
      } else {
        const dafaultlanguage = await store.get("defaultLanguage", "cpp");
        return (dafaultlanguage !== "" && dafaultlanguage) || "cpp";
      }
    });
    // 提出する
    ipcMainManager.on("RUN_SUBMIT_NOWTOP", (event) => {
      this.submitNowTop();
    });
    // コードテストを実行
    ipcMainManager.on(
      "RUN_CODETEST_NOWTOP",
      async (event, infoData: codeTestInfo) => {
        if (this.nowTop !== null) {
          await this.taskAll[this.nowTop].codeTest(infoData);
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
