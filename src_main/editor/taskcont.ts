// ソースファイルと問題URLを管理する
// Editor、TaskViewの状態を管理する
import { dialog } from "electron";
import { taskViewWindowApi } from "../browser/taskviewwindow";
import { editorViewapi } from "../browserview/editorview";
import { atcoderCodeTestApi } from "../data/casetester/runtest_atcoder";
import { Atcoder } from "../data/atcoder";
import { SampleCase, scrapingSampleCase } from "../data/scraping/samplecase";

import { runSubmit } from "../data/submit";
import { languagetype, languages } from "../file/extension";
import {
  existSamplecases,
  loadAllSamplecase,
  saveSanplecase,
} from "../file/sample-fs";
import { ipcMainManager } from "../ipc/ipc";
import { hisuiEvent } from "../event/event";
import { TaskListApi } from "../data/task";
import { baseAtCoderUrl } from "../static";
import { readFileData, writeFileData } from "../file/editor-fs";
import { hisuiEditorChangeModelContentObject } from "../interfaces";
import { store } from "../save/save";
import { submitLanguage } from "../data/scraping/submitlang";
export interface createEditorModelType {
  id: string;
  value: string;
  language: languagetype;
  // LSPの初期設定に必要なPath情報
  path: string;
}
export interface syncEditorType {
  id: string;
  value: string;
}
export interface changeLanguageType {
  id: string;
  language: string;
}
/**
 * 問題のシステムジャッジ結果
 * AC:正解
 * WA:不正解（理由は含めずACではない場合）
 * judge:ジャッジの回答待ち
 * unknown:不明(初期値)
 */
export type JudgeStatus = "AC" | "WA" | "judge" | "unknown";
export interface editorStatus {
  contestName: string;
  TaskScreenName: string;
  AssignmentName: string | null;
  language: string;
  submitLanguage: submitLanguage | null;
  taskcodeByte: number | string;
}

/**
 * １つのTaskを管理するClass
 */
export class taskcont {
  // 問題の基本データに関する変数
  // ex:ABC001
  contestName: string;
  // ex:abc206_a
  taskScreenName: string;
  // ex:A
  AssignmentName: string | null;

  // コード管理に関する変数
  language: languagetype;
  // 提出する言語 コンパイラー別などに対応
  submitLanguage: submitLanguage;
  // ファイルから読み込みされるデータ
  Data: string | null = null;

  // この問題に関する状態を管理

  // ファイルのフルパス
  filePath: string | null = null;
  // ファイルの内容がエディターで変更されているか
  change: boolean = false;

  // advanced State
  // 提出状況を保持
  SubmitState: JudgeStatus = "unknown";

  constructor(
    contestName: string,
    TaskScreenName: string,
    language: languagetype
  ) {
    // TaskContイベントを発行
    hisuiEvent.emit("create-taskcont", TaskScreenName);
    this.contestName = contestName;
    this.taskScreenName = TaskScreenName;
    this.AssignmentName = "";
    this.language = language;
    this.submitLanguage = store.get("submitLanguage", {
      LanguageId: "4003",
      Languagename: "C++ (GCC 9.2.1)",
    });
    this.setup(contestName, TaskScreenName, language).then(() => {
      ipcMainManager.send("LISTENER_CHANGE_TASK_CONT_STATUS");
    });
  }

  // 基本操作
  /**
   * TaskViewを開く
   * ファイルのロード
   * Editorに反映
   */
  async setup(
    contestName: string,
    TaskScreenName: string,
    language: languagetype
  ) {
    await this.openTaskView(contestName, TaskScreenName);
    const AssignmentName = await TaskListApi.getAssignmentName(
      contestName,
      TaskScreenName
    );
    this.AssignmentName = AssignmentName;
    const Data = await this.fileload(contestName, TaskScreenName, language);
    this.Data = Data;
    this.sendValueStatus();
    if (this.filePath) {
      this.setupEditor(TaskScreenName, Data, language, this.filePath);
    }
  }
  /**
   * このクラスを破棄する直前に実行する
   * ファイルの保存状況を確認
   * TaskViewを閉じる
   */
  async close() {
    taskViewWindowApi.removeView(this.taskScreenName);
    this.save();
    this.closeModelEditor();
  }

  // ファイル
  /**
   * ファイルを読み込む（初期設定）
   */
  async fileload(
    contestName: string,
    TaskScreenName: string,
    language: languagetype
  ) {
    const Data = await readFileData(contestName, TaskScreenName, language);
    this.filePath = Data.saveDir;
    this.Data = Data.data;
    return Data.data;
  }

  /**
   * データをファイルに保存
   */
  async save() {
    console.log(`saveEvent${this.taskScreenName}}`);
    if (this.Data !== null) {
      const status = await writeFileData(
        this.Data,
        this.contestName,
        this.taskScreenName,
        this.language
      );
      this.change = false;
      return status;
    } else {
      return false;
    }
  }

  /**
   * 言語を変更
   * Load:言語変更の際EditorのValueをどうするか
   * true=ファイルを読み込み直す
   * false=EditorのValueを引き継ぐ
   */
  async languageChange(language: languagetype, load: boolean) {
    await this.save();
    this.language = language;
    // ファイルを読み込むことで存在確認する
    const fileData = await readFileData(
      this.contestName,
      this.taskScreenName,
      this.language
    );
    this.filePath = fileData.saveDir;
    this.changeLanguageEditor(language);
    this.Data = fileData.data;
    await this.syncEditorValue(fileData.data);
  }

  // TaskView
  /**
   * TaskViewを開く(初期設定)
   */
  async openTaskView(contestName: string, TaskScreenName: string) {
    const taskUrl = `${baseAtCoderUrl}${contestName}/tasks/${TaskScreenName}`;
    console.log(taskUrl);

    await taskViewWindowApi.addView(TaskScreenName, taskUrl);
  }
  /**
   * TaskViewを一番上に持ってくる
   */
  async settopTaskView() {
    taskViewWindowApi.changeViewTop(this.taskScreenName);
  }
  /**
   * TaskViewをリロードする
   */
  async reloadTaskView() {
    taskViewWindowApi.reloadView(this.taskScreenName);
  }
  /**
   * TaskViewを元のURLに戻す
   */
  async resetTaskView() {
    taskViewWindowApi.resetView(this.taskScreenName);
  }

  // editor
  /**
   * editorと状態をファイルの状態を同期
   * ファイルに保存されているデータを優先する
   * changeValue
   */
  async syncEditorValue(value: string) {
    this.sendValueEditor(value);
  }
  private async sendValueEditor(data: string) {
    const syncEditor: syncEditorType = {
      id: this.taskScreenName,
      value: data,
    };
    editorViewapi.view?.webContents.send("changeValue", syncEditor);
  }
  /**
   * editorの初期設定
   * ロード、言語設定
   */
  async setupEditor(
    id: string,
    value: string,
    language: languagetype,
    path: string
  ) {
    const createEditorModel: createEditorModelType = {
      id,
      value,
      language,
      path,
    };
    editorViewapi.view?.webContents.send("createModel", createEditorModel);
  }
  /**
   * 言語変更をEditorに送信
   */
  changeLanguageEditor(language: languagetype) {
    const changeLanguage: changeLanguageType = {
      id: this.taskScreenName,
      language,
    };
    editorViewapi.view?.webContents.send("changeLanguage", changeLanguage);
  }
  /**
   * モデルの削除
   */
  closeModelEditor() {
    ipcMainManager.send("LISTENER_EDITOR_MODEL_REMOVE", this.taskScreenName);
  }
  /**
   * Editorのモデル更新イベントを受け取りValueを取得
   */
  async changeEvent(arg: hisuiEditorChangeModelContentObject) {
    this.Data = arg.editorValue;
    this.change = true;
    this.sendValueStatus();
  }
  /**
   * ToolbarにEditorの状態を送信する
   */
  async sendValueStatus() {
    const byteLength = Buffer.byteLength(String(this.Data), "utf8");
    const result: editorStatus = {
      contestName: this.contestName,
      TaskScreenName: this.taskScreenName,
      AssignmentName: this.AssignmentName,
      language: this.language,
      submitLanguage: this.submitLanguage,
      taskcodeByte: byteLength,
    };
    ipcMainManager.send("LISTENER_EDITOR_STATUS", result);
  }

  // 提出
  /**
   * 設定されている問題に向けて提出を実行する
   */
  async submit() {
    this.save();
    const selectStatus = await dialog.showMessageBox({
      type: "info",
      title: "提出確認",
      message: "提出してもいいですか？",
      buttons: ["提出", "キャンセル"],
    });
    if (selectStatus.response === 0) {
      await this.save();
      if (this.Data !== null) {
        runSubmit(
          this.contestName,
          this.taskScreenName,
          this.Data,
          languages[this.language].submitLanguageId
        );
      }
    }
  }

  /**
   * サンプルケースを使いコードをテストする
   */
  async codeTest(samplecase: string, answer: string | null = null) {
    await this.save();
    if (this.Data !== null) {
      atcoderCodeTestApi.runCodeTest(
        this.language,
        this.Data,
        samplecase,
        answer,
        this.taskScreenName
      );
      return "success";
    } else {
      return "codeIsNull";
    }
  }
  /**
   * サンプルケースを取得、キャッシュする
   * 保存されていない場合問題ページから取得
   * 保存してある場合はファイルから読み込む
   */
  async getAllSamplecase(
    cache: boolean = true
  ): Promise<SampleCase[] | "load_Error" | "request_Error"> {
    const existsamplecase = await existSamplecases(
      this.contestName,
      this.taskScreenName
    );
    if (existsamplecase === false || cache === false) {
      // サンプルケースを問題ページからダウンロード
      const url = `https://atcoder.jp/contests/${this.contestName}/tasks/${this.taskScreenName}`;
      const getTaskPage = await Atcoder.axiosInstance.get(url);
      if (getTaskPage.status === 200) {
        // サンプルケースをスクレイピングする
        const scrapingReturn = scrapingSampleCase(getTaskPage.data);
        // スクレイピングしたものをキャッシュとしてファイルに保存
        scrapingReturn.forEach((element) => {
          saveSanplecase(
            this.contestName,
            this.taskScreenName,
            element.name,
            element.case,
            element.answer
          );
        });
        return scrapingReturn;
      } else {
        return "request_Error";
      }
    } else {
      // ファイルからキャッシュされたサンプルケースを読み込む
      const returnData = await loadAllSamplecase(
        this.contestName,
        this.taskScreenName
      );
      if (returnData === "not_saved") {
        return "load_Error";
      } else {
        return returnData;
      }
    }
  }
}
