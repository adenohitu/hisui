// ソースファイルと問題URLを管理する
// Editor、TaskViewの状態を管理する
import { taskViewWindowApi } from "../browser/taskviewwindow";
import { languageselect, languagetype } from "../file/extension";
import { readFileAwait, runMakeFile, writeFileAwait } from "../file/mkfile";

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
    const filePath = await runMakeFile(
      `${AssignmentName}${languageselect[language]}`,
      contestName
    );
    const Data = await readFileAwait(filePath);
    this.filePath = filePath;
    this.Data = Data;
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
    }
  }

  /**
   * データをファイルに保存
   */
  async save() {
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
    // 再読み込み
    await this.filereload();
  }

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
   */
  async asyncEditor() {}
  /**
   * editorの初期設定
   * ロード、言語設定
   */
  async setupEditor() {}
}
