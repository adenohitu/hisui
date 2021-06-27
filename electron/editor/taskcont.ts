// ソースファイルと問題URLを管理する
// Editor、TaskViewの状態を管理する
import { ipcMain } from "electron";
import { taskViewWindowApi } from "../browser/taskviewwindow";
import { editorViewapi } from "../browserview/editorview";
import { languageselect, languagetype } from "../file/extension";
import { readFileAwait, runMakeFile, writeFileAwait } from "../file/mkfile";
export interface createEditorModelType {
  id: string;
  value: string;
  language: languagetype;
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
 * １つのTaskを管理するClass
 */
export class taskcont {
  // 問題の基本データに関する変数
  // ex:ABC001
  contestName: string;
  // ex:abc206_a
  TaskScreenName: string;
  // ex:A
  AssignmentName: string;

  // コード管理に関する変数
  language: languagetype;
  // ファイルから読み込みされるデータ
  Data: string | null = null;

  // この問題に関する状態を管理

  // ファイルのフルパス
  filePath: string | null = null;
  // ファイルの内容がエディターで変更されているか
  Change: boolean = false;

  // advanced State

  /**
   * 問題のジャッジ状況
   * AC:正解
   * WA:不正解（理由は含めずACではない場合）
   * judge:ジャッジの回答待ち
   * unknown:不明(初期値)
   */
  SubmitState: "AC" | "WA" | "judge" | "unknown" = "unknown";

  constructor(
    contestName: string,
    TaskScreenName: string,
    AssignmentName: string,
    language: languagetype
  ) {
    this.contestName = contestName;
    this.TaskScreenName = TaskScreenName;
    this.AssignmentName = AssignmentName;
    this.language = language;
    this.setup(contestName, TaskScreenName, AssignmentName, language);
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
    AssignmentName: string,
    language: languagetype
  ) {
    await this.openTaskView(contestName, TaskScreenName);

    const Data = await this.fileload(contestName, AssignmentName, language);
    this.setupEditor(TaskScreenName, Data, language);
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
    AssignmentName: string,
    language: languagetype
  ) {
    const filePath = await runMakeFile(
      `${AssignmentName}${languageselect[language]}`,
      contestName
    );
    const Data = await readFileAwait(filePath);
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
      const Data = await readFileAwait(this.filePath);
      this.Data = Data;
      await this.syncEditor();
    }
  }

  /**
   * データをファイルに保存
   */
  async save() {
    this.Data = await this.getValueEditor();
    if (this.Data !== null && this.filePath !== null) {
      const status = await writeFileAwait(this.filePath, this.Data);
      return status;
    } else {
      return false;
    }
  }

  /**
   * 言語を変更
   */
  async languageChange(language: languagetype) {
    this.language = language;
    // ファイルの存在、新規作成
    const filePath = await runMakeFile(
      `${this.AssignmentName}${languageselect[language]}`,
      this.contestName
    );
    this.filePath = filePath;
    this.changeLanguageEditor(language);
    // 再読み込み
    await this.filereload();
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
  async syncEditor() {
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
    editorViewapi.editorView?.webContents.send("changeValue", syncEditor);
  }
  /**
   * editorの初期設定
   * ロード、言語設定
   */
  async setupEditor(id: string, value: string, language: languagetype) {
    const createEditorModel: createEditorModelType = { id, value, language };
    editorViewapi.editorView?.webContents.send(
      "createModel",
      createEditorModel
    );
  }
  /**
   * 言語変更をEditorに送信
   */
  changeLanguageEditor(language: languagetype) {
    const changeLanguage: changeLanguageType = {
      id: this.TaskScreenName,
      language,
    };
    editorViewapi.editorView?.webContents.send(
      "changeLanguage",
      changeLanguage
    );
  }
  /**
   * モデルの削除
   */
  closeModelEditor() {
    editorViewapi.editorView?.webContents.send(
      "closeModel",
      this.TaskScreenName
    );
  }
  /**
   * editorからValueを取得する
   */
  getValueEditor(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Editorから結果を取得する準備
      ipcMain.once("getValue_replay", (event, value: string) => {
        resolve(value);
      });
      // editorにValueを送信するよう命令
      editorViewapi.editorView?.webContents.send(
        "getValue",
        this.TaskScreenName
      );
    });
  }
}