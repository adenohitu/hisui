// ソースファイルと問題URLを管理する
// Editor、TaskViewの状態を管理する
import { dialog } from "electron";
import { taskViewWindowApi } from "../browser/taskviewwindow";
import { codeTestApi, codeTestInfo } from "../code-test/codetest";
import { Atcoder } from "../data/atcoder";
import { SampleCase, scrapingSampleCase } from "../data/scraping/samplecase";

import { runSubmit } from "../data/submit";
import { languagetype } from "../file/extension";
import {
  existSamplecases,
  loadAllSamplecase,
  saveSanplecase,
} from "../file/sample-fs";
import { ipcMainManager } from "../ipc/ipc";
import { readCodeFileData, writeCodeFileData } from "../file/editor-fs";
import { hisuiEditorChangeModelContentObject } from "../interfaces";
import { submitLanguage } from "../data/scraping/submitlang";
import { logger } from "../tool/logger/logger";
import path from "path";
import { getDefaultLanguageinfo } from "./language-tool";
import { taskCodeInfo } from "../file/taskinfo";
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
  taskCodeInfo: taskCodeInfo;

  margeTaskId: string;
  // ex:A
  AssignmentName: string | null;

  // 提出する言語 コンパイラー別などに対応
  submitLanguage: submitLanguage;
  // ファイルから読み込みされるデータ
  Data: string = "";

  // この問題に関する状態を管理

  // ファイルのフルパス
  filePath: string = "";
  fileName: string = "";
  // ファイルの内容がエディターで変更されているか
  change: boolean = false;

  constructor(
    taskCodeInfoProps: taskCodeInfo,
    filePath: string,
    fileName: string
  ) {
    // TaskContイベントを発行
    this.taskCodeInfo = taskCodeInfoProps;
    const margeId = `${taskCodeInfoProps.service}-${taskCodeInfoProps.taskGroup}-${taskCodeInfoProps.taskID}`;
    this.margeTaskId = margeId;
    this.AssignmentName = "";
    this.filePath = filePath;
    this.fileName = fileName;
    // デフォルトの提出言語を設定
    this.submitLanguage = getDefaultLanguageinfo(
      taskCodeInfoProps.editorInfo.languagetype
    );
    this.setup(taskCodeInfoProps, margeId, filePath, fileName).then(() => {
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
    taskCodeInfoProps: taskCodeInfo,
    margeId: string,
    filePath: string,
    fileName: string
  ) {
    return await Promise.all([
      await this.openTaskView(margeId, taskCodeInfoProps.taskURL),
      this.fileloadAndSetupEditor(
        margeId,
        taskCodeInfoProps,
        filePath,
        fileName
      ),
    ]);
  }

  async fileloadAndSetupEditor(
    margeId: string,
    taskCodeInfoProps: taskCodeInfo,
    filePath: string,
    fileName: string
  ) {
    const data = await readCodeFileData(filePath);
    this.Data = data;
    await this.setupEditor(
      margeId,
      data,
      taskCodeInfoProps.editorInfo.languagetype,
      taskCodeInfoProps.taskURL
    );
    this.sendValueStatus();
  }
  /**
   * このクラスを破棄する直前に実行する
   * ファイルの保存状況を確認
   * TaskViewを閉じる
   */
  async close() {
    taskViewWindowApi.removeView(this.margeTaskId);
    this.save();
    this.closeModelEditor();
  }

  // ファイル

  /**
   * データをファイルに保存
   */
  async save() {
    logger.info(`saveEvent:margeId=${this.margeTaskId}`, "taskContClass");
    return await writeCodeFileData(
      this.filePath,
      this.fileName,
      this.Data,
      this.taskCodeInfo
    );
  }

  async submitLanguageChange(arg: submitLanguage) {
    this.submitLanguage = arg;
    this.sendValueStatus();
  }

  // TaskView
  /**
   * TaskViewを開く(初期設定)
   */
  async openTaskView(margeId: string, taskURL: string) {
    logger.info(`OpenViewRequest:URL=${taskURL}`, "taskContClass");
    // 確定でNowTopに設定される
    await taskViewWindowApi.addView(margeId, taskURL, undefined, true);
  }
  /**
   * TaskViewを一番上に持ってくる
   */
  async settopTaskView() {
    taskViewWindowApi.changeViewTop(this.margeTaskId);
  }
  /**
   * TaskViewをリロードする
   */
  async reloadTaskView() {
    taskViewWindowApi.reloadView(this.margeTaskId);
  }
  /**
   * TaskViewを元のURLに戻す
   */
  async resetTaskView() {
    taskViewWindowApi.resetView(this.margeTaskId);
  }

  // editor
  /**
   * editorと状態をファイルの状態を同期
   * ファイルに保存されているデータを優先する
   */
  async syncEditorValue(value: string) {
    this.sendValueEditor(value);
  }
  private async sendValueEditor(data: string) {
    const syncEditor: syncEditorType = {
      id: this.margeTaskId,
      value: data,
    };
    ipcMainManager.send("CHANGE_EDITOR_VALUE", syncEditor);
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
    ipcMainManager.send("CREATE_EDITOR_MODEL", createEditorModel);
  }
  /**
   * モデルの削除
   */
  closeModelEditor() {
    ipcMainManager.send("LISTENER_EDITOR_MODEL_REMOVE", this.margeTaskId);
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
      contestName: this.taskCodeInfo.taskGroup,
      TaskScreenName: this.taskCodeInfo.taskID,
      AssignmentName: this.AssignmentName,
      language: this.taskCodeInfo.editorInfo.languagetype,
      submitLanguage: this.submitLanguage,
      taskcodeByte: byteLength,
    };
    ipcMainManager.send("LISTENER_EDITOR_STATUS", result);

    taskViewWindowApi.win?.webContents.send(
      "LISTENER_NOW_PRIMARY_VIEW",
      this.taskCodeInfo.taskID
    );
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
      message: `${this.taskCodeInfo.taskGroup}-${this.AssignmentName} ${this.submitLanguage.Languagename}`,
      buttons: ["Yes(提出)", "Cancel"],
    });

    if (selectStatus.response === 0) {
      await this.save();
      if (this.Data !== null) {
        runSubmit(
          this.taskCodeInfo.taskGroup,
          this.taskCodeInfo.taskID,
          this.Data,
          this.submitLanguage.LanguageId
        );
        console.log("ok");
      }
    }
  }

  /**
   * サンプルケースを使いコードをテストする
   */
  async codeTest(infoData: codeTestInfo) {
    const addTaskScreenName = infoData;
    addTaskScreenName.TaskScreenName = this.taskCodeInfo.taskID;
    await this.save();
    if (this.Data !== null) {
      codeTestApi.runCodeTest(
        this.submitLanguage.LanguageId,
        this.Data,
        addTaskScreenName,
        this.filePath,
        path.join(this.filePath, "..")
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
      this.taskCodeInfo.taskGroup,
      this.taskCodeInfo.taskID
    );
    if (existsamplecase === false || cache === false) {
      logger.info(
        `getAllSampleCase:URL=${this.taskCodeInfo.taskID}`,
        "taskContClass"
      );
      // サンプルケースを問題ページからダウンロード
      const url = `https://atcoder.jp/contests/${this.taskCodeInfo.taskGroup}/tasks/${this.taskCodeInfo.taskID}`;
      const getTaskPage = await Atcoder.axiosInstance.get(url);
      if (getTaskPage.status === 200) {
        // サンプルケースをスクレイピングする
        const scrapingReturn = scrapingSampleCase(getTaskPage.data);
        // スクレイピングしたものをキャッシュとしてファイルに保存
        scrapingReturn.forEach((element) => {
          saveSanplecase(
            this.taskCodeInfo.taskGroup,
            this.taskCodeInfo.taskID,
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
      logger.info(
        `LoadCache AllSampleCase:URL=${this.taskCodeInfo.taskID}`,
        "taskContClass"
      );

      // ファイルからキャッシュされたサンプルケースを読み込む
      const returnData = await loadAllSamplecase(
        this.taskCodeInfo.taskGroup,
        this.taskCodeInfo.taskID
      );
      if (returnData === "not_saved") {
        return "load_Error";
      } else {
        return returnData;
      }
    }
  }
}
