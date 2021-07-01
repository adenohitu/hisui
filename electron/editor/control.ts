// taskcontを管理するApi
import { ipcMain } from "electron";
import { editorViewapi } from "../browserview/editorview";
import { getDefaultContestID } from "../data/contestdata";
import { hisuiEvent } from "../event/event";
import { languagetype } from "../file/extension";
import { store } from "../save/save";
import { taskcont } from "./taskcont";
export interface createTaskContType {
  contestName: string;
  TaskScreenName: string;
  AssignmentName: string;
  // 指定がない場合、デフォルトの言語を使用
  language?: languagetype;
}
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
    this.DefaultContestID = await getDefaultContestID();
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
    language: languagetype | undefined
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
  async changeTask(TaskScreenName: string) {
    // ViewのTopの変更
    this.taskAll[TaskScreenName].settopTaskView();
    // editorEvent
    // editorの更新をチェック
    // editorのモデルをチェンジ
    editorViewapi.editorView?.webContents.send("setModel", TaskScreenName);
  }
  /**
   * editor側からイベントを受け取る
   */
  setupIPCMain() {
    // taskcontを作成する
    ipcMain.on("createTaskCont", (event, arg: createTaskContType) => {
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

    // dafaultlangageに関するIPC
    // デフォルトの言語を変更
    ipcMain.on("setdefaultLanguage", (event, language: languagetype) => {
      // storeに保存
      console.log(language);

      store.set("defaultLanguage", language);
      // ついでに今開いてるファイルの言語を変更
      if (this.nowTop !== null) {
        console.log(this.nowTop);

        this.taskAll[this.nowTop].languageChange(language);
      }
    });
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
  }
}

export const taskControlApi = new taskControl();
