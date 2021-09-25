import { EventEmitter } from "stream";
import { ipcSendall } from "../browserview/mgt/ipcall";
import { Atcoder } from "../data/atcoder";
import { contestDataApi } from "../data/contestdata";
import {
  languagetype,
  languagetypeId,
  submitLanguageId,
} from "../file/extension";
import { ansCheck } from "./judgetool";
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
    LanguageId: languagetypeId;
    LanguageName: string;
  };
  Stderr: string;
  Stdout: string;
}
interface codeTestIn {
  submitLanguageId: number;
  code: string;
  input: string;
}
class atcoderCodeTest {
  CodeTestEmitter: CodeTestEmitter;
  CodeTeststatus: "CodeTest" | "ready";
  nowInput: string;
  nowAns: string | null;
  codeTestQueue: codeTestIn[];
  constructor() {
    this.CodeTestEmitter = new EventEmitter();
    this.CodeTeststatus = "ready";
    this.nowInput = "";
    this.nowAns = null;
    this.codeTestQueue = [];
  }
  /**
   * コードを実行する
   */
  async runCodeTest(
    lang: languagetype,
    code: string,
    input: string,
    answer: string | null = null
  ) {
    if (this.CodeTeststatus === "ready") {
      const customTestPostURL = `${this.getcustomTestURL()}/submit/json`;
      const csrf_token = await Atcoder.getCsrftoken(
        true,
        this.getcustomTestURL()
      );

      const params = new URLSearchParams();
      params.append("data.LanguageId", String(submitLanguageId[lang]));
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
          this.CodeTeststatus = "CodeTest";
          this.nowInput = input;
          this.nowAns = answer;
          this.CodeTestchecker();
          return "success";
        } else {
          return "error:statuscode";
        }
      } catch (error) {
        console.log(error);
        return "error:axiosInstance";
      }
    } else {
      return "isrunning";
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
        if (Result["Interval"] !== undefined) {
          Result.ansStatus = "WJ";
          Result.answer = this.nowAns;
          this.sendCodeTestStatus(Result);
          this.CodeTestEmitter.emit("checker", Result);
          var serf = this;
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
        }
      }
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
    ipcSendall("codeTestStatusEvent", data);
  }
}
export const atcoderCodeTestApi = new atcoderCodeTest();
