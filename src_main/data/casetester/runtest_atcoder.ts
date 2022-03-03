// AtCoder custom_testを使ったコードのテスト
//Copyright © 2021-2022 adenohitu. All rights reserved.
import { EventEmitter } from "events";
import { ipcMainManager } from "../../ipc/ipc";
import { Atcoder } from "../atcoder";
import { contestDataApi } from "../contestdata";
import { ansCheck } from "./judgetool";
const sleepTime = 2000;
/**
 * コードテストが実行されたときに発生するイベント
 */
export declare class CodeTestEmitter extends EventEmitter {
  // コードをPostした瞬間に発生
  on(event: "run", listener: () => void): this;
  once(event: "run", listener: () => void): this;
  emit(event: "run"): boolean;

  // 状態取得の更新が行われるたびに発生
  on(event: "checker", listener: (status: atcoderCodeTestResult) => void): this;
  once(
    event: "checker",
    listener: (status: atcoderCodeTestResult) => void
  ): this;
  emit(event: "checker", status: atcoderCodeTestResult): boolean;

  // 結果が帰ってきたときに発生
  on(event: "finish", listener: (status: atcoderCodeTestResult) => void): this;
  once(
    event: "finish",
    listener: (status: atcoderCodeTestResult) => void
  ): this;
  emit(event: "finish", status: atcoderCodeTestResult): boolean;
}
/**
 * atcoderのコードテストで帰ってくるデータそのものに
 * ansStatusを足したもの
 */
export interface atcoderCodeTestResult {
  TaskScreenName?: string;
  ansStatus?: string;
  answer?: string | null;
  Interval?: number;
  Result: {
    Id: number;
    SourceCode: string;
    Input: string;
    Output: string;
    Error: string;
    TimeConsumption: number;
    MemoryConsumption: number;
    ExitCode: number;
    Status: number;
    // ISO 8601
    Created: string;
    LanguageId: number;
    LanguageName: string;
  };
  Stderr: string;
  Stdout: string;
}
export interface codeTestIn {
  languageId: string | number;
  code: string;
  input: string;
  answer: string | null;
  TaskScreenName?: string;
}
class atcoderCodeTest {
  CodeTestEmitter: CodeTestEmitter;
  CodeTeststatus: "CodeTest" | "ready";
  nowInput: string;
  nowAns: string | null;
  nowTaskScreenName: string | undefined;
  codeTestQueue: codeTestIn[];

  constructor() {
    this.CodeTestEmitter = new EventEmitter();
    this.CodeTeststatus = "ready";
    this.nowInput = "";
    this.nowAns = null;
    this.nowTaskScreenName = undefined;
    this.codeTestQueue = [];
    this.LISTENER_sendCodeTestStatusFinish();
  }

  /**
   * コードを実行する
   */
  async runCodeTest(
    languageId: string | number,
    code: string,
    input: string,
    answer: string | null = null,
    TaskScreenName?: string
  ) {
    if (this.CodeTeststatus === "ready") {
      this.CodeTeststatus = "CodeTest";
      const customTestPostURL = `${this.getcustomTestURL()}/submit/json`;
      const csrf_token = await Atcoder.getCsrftoken(
        true,
        this.getcustomTestURL()
      );

      const params = new URLSearchParams();
      params.append("data.LanguageId", String(languageId));
      params.append("sourceCode", code);
      params.append("input", input);
      params.append("csrf_token", csrf_token[0]);
      try {
        const res = await Atcoder.axiosInstance.post(
          customTestPostURL,
          params,
          {
            maxRedirects: 0,
            validateStatus: (status) =>
              (status >= 200 && status < 300) || status === 302,
          }
        );

        if (res.status === 200) {
          // 結果待機
          this.CodeTestEmitter.emit("run");
          this.nowInput = input;
          this.nowAns = answer;
          this.nowTaskScreenName = TaskScreenName;
          this.CodeTestchecker();
          return "success";
        } else {
          this.CodeTeststatus = "ready";
          return "error:statuscode";
        }
      } catch (error) {
        console.log(error);
        return "error:axiosInstance";
      }
    } else {
      this.codeTestQueue.push({
        languageId,
        code,
        input,
        answer,
        TaskScreenName,
      });
      return "AddQueue";
    }
  }
  /**
   * 結果を待機
   */
  private async CodeTestchecker() {
    if (this.CodeTeststatus === "CodeTest") {
      const checkURL = `${this.getcustomTestURL()}/json?reload=true`;
      const Data = await Atcoder.axiosInstance.get(checkURL);
      // 結果に型をつける
      const Result: atcoderCodeTestResult = Data.data;
      // resultを加工
      Result.Result.Input = this.nowInput;

      if (Data.status === 200) {
        console.dir({ id: Result.Result.Id, Interval: Result.Interval });
        Result.TaskScreenName = this.nowTaskScreenName;
        if (Result["Interval"] !== undefined) {
          Result.ansStatus = "WJ";
          Result.answer = this.nowAns;
          this.sendCodeTestStatus(Result);
          this.CodeTestEmitter.emit("checker", Result);
          const serf = this;
          setTimeout(() => {
            serf.CodeTestchecker();
          }, Result["Interval"]);
        } else {
          if (this.nowAns) {
            const ansstatus = ansCheck(this.nowAns, Result.Stdout);
            Result.answer = this.nowAns;
            Result["ansStatus"] = ansstatus;
          }
          this.CodeTestEmitter.emit("finish", Result);
          this.CodeTeststatus = "ready";
          /**
           * キューに待機があればSleep時間後実行
           */
          if (this.codeTestQueue.length !== 0) {
            const serf = this;
            setTimeout(() => {
              serf.runNextTest();
            }, sleepTime);
          }
        }
      }
    }
  }
  runNextTest() {
    const next = this.codeTestQueue.shift();
    if (next) {
      this.runCodeTest(
        next.languageId,
        next.code,
        next.input,
        next.answer,
        next.TaskScreenName
      );
    }
  }
  /**
   * コードテストのページのURLを取得
   * @returns https://atcoder.jp/contests/${contestid}/custom_test
   */
  private getcustomTestURL() {
    const contestid = contestDataApi.getDefaultContestID();
    return `https://atcoder.jp/contests/${contestid}/custom_test`;
  }
  private sendCodeTestStatus(data: atcoderCodeTestResult) {
    ipcMainManager.send("LISTENER_CODETEST_STATUS_EVENT", data);
  }
  private LISTENER_sendCodeTestStatusFinish() {
    this.CodeTestEmitter.on("finish", async (res) => {
      ipcMainManager.send("LISTENER_CODETEST_STATUS_EVENT", res);
    });
  }
}
export const atcoderCodeTestApi = new atcoderCodeTest();
