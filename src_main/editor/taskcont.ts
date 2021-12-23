// ソースファイルと問題URLを管理する
// Editor、TaskViewの状態を管理する
import { dialog, ipcMain } from "electron";
import { readFile } from "fs/promises";
import { taskViewWindowApi } from "../browser/taskviewwindow";
import { editorViewapi } from "../browserview/editorview";
import { atcoderCodeTestApi } from "../data/casetester/runtest_atcoder";
import { Atcoder } from "../data/atcoder";
import { SampleCase, scrapingSampleCase } from "../data/scraping/samplecase";

import { runSubmit } from "../data/submit";
import { languagetype, languages } from "../file/extension";
import { runMakeFile, writeFileAwait } from "../file/mkfile";
import {
  existSamplecases,
  loadAllSamplecase,
  saveSanplecase,
} from "../file/save";
import { ipcMainManager } from "../ipc/ipc";
import { hisuiEvent } from "../event/event";
import { TaskListApi } from "../data/task";
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
  taskcodeByte: number;
}

/**
 * １つのTaskを管理するClass
 */
export class taskcont {
  // 問題の基本データに関する変数
  // ex:ABC001
  contestName: string;
  // ex:abc206_a
  TaskScreenName: string;
  // ex:A
  AssignmentName: string | null;

  // コード管理に関する変数
  language: languagetype;
  // ファイルから読み込みされるデータ
  Data: string | null = null;

  // この問題に関する状態を管理

  // ファイルのフルパス
  filePath: string | null = null;
  // ファイルの内容がエディターで変更されているか
  change: boolean = false;

  // advanced State

  /**
   * 問題のシステムジャッジ状況
   * AC:正解
   * WA:不正解（理由は含めずACではない場合）
   * judge:ジャッジの回答待ち
   * unknown:不明(初期値)
   */
  SubmitState: "AC" | "WA" | "judge" | "unknown" = "unknown";

  constructor(
    contestName: string,
    TaskScreenName: string,
    language: languagetype
  ) {
    // TaskContEヴェンtを追加
    hisuiEvent.emit("create-taskcont", TaskScreenName);
    this.contestName = contestName;
    this.TaskScreenName = TaskScreenName;
    this.AssignmentName = null;
    this.language = language;
    this.setup(contestName, TaskScreenName, language);
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
    taskViewWindowApi.removeView(this.TaskScreenName);
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
    const filePath = await runMakeFile(
      `${TaskScreenName}${languages[language].extension}`,
      contestName
    );
    const Data = await readFile(filePath, "utf-8");
    this.filePath = filePath;
    this.Data = Data;
    return Data;
  }
  /**
   * ファイルの更新をチェック
   * 別アプリ等で更新した時
   * langを更新した時に実行
   */
  async filereload() {
    if (this.filePath !== null) {
      const Data = await readFile(this.filePath, "utf-8");
      this.Data = Data;
      await this.syncEditorValue();
    }
  }

  /**
   * データをファイルに保存
   */
  async save() {
    this.Data = await this.getValueEditor();
    if (this.Data !== null && this.filePath !== null) {
      const status = await writeFileAwait(this.filePath, this.Data);
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
    this.language = language;
    // ファイルの存在、新規作成
    const filePath = await runMakeFile(
      `${this.TaskScreenName}${languages[language].extension}`,
      this.contestName
    );
    this.filePath = filePath;
    this.changeLanguageEditor(language);
    // 再読み込みするか
    if (load === true) {
      await this.filereload();
    }
  }

  // TaskView
  /**
   * TaskViewを開く(初期設定)
   */
  async openTaskView(contestName: string, TaskScreenName: string) {
    const taskUrl = `${contestName}/tasks/${TaskScreenName}`;
    console.log(taskUrl);

    await taskViewWindowApi.addView(TaskScreenName, taskUrl);
  }
  /**
   * TaskViewを一番上に持ってくる
   */
  async settopTaskView() {
    taskViewWindowApi.changeViewTop(this.TaskScreenName);
  }
  /**
   * TaskViewをリロードする
   */
  async reloadTaskView() {
    taskViewWindowApi.reloadView(this.TaskScreenName);
  }
  /**
   * TaskViewを元のURLに戻す
   */
  async resetTaskView() {
    taskViewWindowApi.resetView(this.TaskScreenName);
  }

  // editor
  /**
   * editorと状態をファイルの状態を同期
   * ファイルに保存されているデータを優先する
   * changeValue
   */
  async syncEditorValue() {
    if (this.Data) {
      this.sendValueEditor(this.Data);
    } else {
      // nullの時空文字を送る
      this.sendValueEditor("");
    }
  }
  private async sendValueEditor(data: string) {
    const syncEditor: syncEditorType = {
      id: this.TaskScreenName,
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
      id: this.TaskScreenName,
      language,
    };
    editorViewapi.view?.webContents.send("changeLanguage", changeLanguage);
  }
  /**
   * モデルの削除
   */
  closeModelEditor() {
    editorViewapi.view?.webContents.send("closeModel", this.TaskScreenName);
  }
  /**
   * editorからValueを取得する
   */
  getValueEditor(): Promise<string> {
    return new Promise((resolve, reject) => {
      const channel = `getValue_replay-${this.TaskScreenName}`;
      // Editorから結果を取得する準備
      ipcMain.once(channel, (event, value: string) => {
        resolve(value);
      });
      // editorにValueを送信するよう命令
      editorViewapi.view?.webContents.send("getValue", this.TaskScreenName);
    });
  }
  /**
   * Editorのモデル更新イベントを受け取りValueを取得
   */
  async changeEvent() {
    const nowEditorData = await this.getValueEditor();
    this.Data = nowEditorData;
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
      TaskScreenName: this.TaskScreenName,
      AssignmentName: this.AssignmentName,
      language: this.language,
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
      const saveStatus = await this.save();
      if (saveStatus === "succsess" && this.Data !== null) {
        runSubmit(
          this.contestName,
          this.TaskScreenName,
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
        this.TaskScreenName
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
  ): Promise<SampleCase[] | "not_saved" | "request_Error"> {
    const existsamplecase = await existSamplecases(
      this.contestName,
      this.TaskScreenName
    );
    if (existsamplecase === false || cache === false) {
      // サンプルケースを問題ページからダウンロード
      const url = `https://atcoder.jp/contests/${this.contestName}/tasks/${this.TaskScreenName}`;
      const getTaskPage = await Atcoder.axiosInstance.get(url);
      if (getTaskPage.status === 200) {
        // サンプルケースをスクレイピングする
        const scrapingReturn = scrapingSampleCase(getTaskPage.data);
        // スクレイピングしたものをキャッシュとしてファイルに保存
        scrapingReturn.forEach((element) => {
          saveSanplecase(
            this.contestName,
            this.TaskScreenName,
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
        this.TaskScreenName
      );
      return returnData;
    }
  }
}
