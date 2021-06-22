// ソースファイルと問題URLを管理する
// Editor、TaskViewの状態を管理する
import { taskViewWindowApi } from "../browser/taskviewwindow";
import { languagetype } from "../file/extension";
import { getFiledata } from "../file/mkfile";

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
  Path: string | null = null;
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
    await this.fileload(contestName, AssignmentName, language);
    await this.openTaskView(contestName, TaskScreenName);
  }
  /**
   * このクラスを破棄する直前に実行する
   * ファイルの保存状況を確認
   * TaskViewを閉じる
   */
  async close() {}

  // ファイル
  /**
   * ファイルを読み込む（初期設定）
   */
  async fileload(
    contestName: string,
    AssignmentName: string,
    language: languagetype
  ) {
    const Data = await getFiledata(contestName, AssignmentName, language);
    this.Data = Data;
  }
  /**
   * ファイルの更新をチェック
   */
  async filereload() {}

  /**
   * データをファイルに保存
   */
  async save() {}

  /**
   * 言語を変更
   */
  async languageChange(language: languagetype) {}

  // TaskView
  /**
   * TaskViewを開く(初期設定)
   */
  async openTaskView(contestName: string, TaskScreenName: string) {
    const taskUrl = `${contestName}/task/${TaskScreenName}`;
    await taskViewWindowApi.addView(TaskScreenName, taskUrl);
  }
  /**
   * TaskViewを一番上に持ってくる
   */
  async settop() {
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
}
/**
 * 全てのtaskcontを管理するAPI
 */
class taskControl {
  taskAll: taskcont[];
  constructor() {
    this.taskAll = [];
  }
}
export const taskControlApi = new taskControl();
