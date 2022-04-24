// AtCoder custom_testを使ったコードのテスト
//Copyright © 2021-2022 adenohitu. All rights reserved.
import { EventEmitter } from "events";
import path from "path";
import { taskViewWindowApi } from "../../browser/taskviewwindow";
import { ipcMainManager } from "../../ipc/ipc";
import { runLocalTest } from "../../runner/local-tester";
import { store } from "../../save/save";
import { Atcoder } from "../atcoder";
import { contestDataApi } from "../contestdata";
import { ansCheck } from "./judgetool";
const sleepTime = 15000;
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
  caseName?: string;
  testGroup?: string;
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
  codeTestProps: codeTestInfo;
}
export interface codeTestInfo {
  input: string;
  answer: string | null;
  TaskScreenName?: string;
  caseName?: string;
  testGroupID?: string;
}
class codeTest {
  CodeTestEmitter: CodeTestEmitter;
  CodeTeststatus: "CodeTest" | "ready";
  nowInput: string;
  nowAns: string | null;
  nowTaskScreenName: string | undefined;
  codeTestQueue: codeTestIn[];
  NowCaseName?: string;
  NowTestGroupID?: string;

  constructor() {
    this.CodeTestEmitter = new EventEmitter();
    this.CodeTeststatus = "ready";
    this.nowInput = "";
    this.nowAns = null;
    this.nowTaskScreenName = undefined;
    this.NowCaseName = "";
    this.NowTestGroupID = "";
    this.codeTestQueue = [];
    this.LISTENER_sendCodeTestStatusFinish();
  }
  async runCodeTest(
    languageId: string | number,
    code: string,
    codeTestProps: codeTestInfo,
    filepath: string,
    rootpath: string
  ) {
    // Modeで振り分け
    const getMode = store.get("judgeMode", "online");
    if (getMode === "local" && languageId === "4003") {
      this.runCodeTestLocal(
        languageId,
        code,
        codeTestProps,
        filepath,
        rootpath
      );
    } else {
      this.runCodeTestAtCoder(languageId, code, codeTestProps);
    }
  }
  /**
   * コードを実行する Local
   */
  async runCodeTestLocal(
    languageId: string | number,
    code: string,
    codeTestProps: codeTestInfo,
    filepath: string,
    rootpath: string
  ) {
    const outfilepath = path.join(
      rootpath,
      codeTestProps.TaskScreenName + ".out"
    );
    const compilerPath = store.get("compilerPath.cpp", "g++");
    this.nowInput = codeTestProps.input;
    this.nowAns = codeTestProps.answer;
    this.nowTaskScreenName = codeTestProps.TaskScreenName;
    this.NowCaseName = codeTestProps.caseName;
    this.NowTestGroupID = codeTestProps.testGroupID;
    runLocalTest({
      compilerPath,
      filepath: filepath,
      outfilepath,
      codeTestIn: {
        languageId: languageId,
        code: code,
        codeTestProps: codeTestProps,
      },
    }).then((e) => {
      const anscheck_after = e;
      if (this.nowAns) {
        const ansstatus = ansCheck(this.nowAns, anscheck_after.Stdout);
        anscheck_after.answer = this.nowAns;
        anscheck_after.ansStatus = ansstatus;
      }
      this.CodeTestEmitter.emit("finish", anscheck_after);
    });
  }

  /**
   * コードを実行する AtCoderCodeTest
   */
  async runCodeTestAtCoder(
    languageId: string | number,
    code: string,
    codeTestProps: codeTestInfo
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
      params.append("input", codeTestProps.input);
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
          this.nowInput = codeTestProps.input;
          this.nowAns = codeTestProps.answer;
          this.nowTaskScreenName = codeTestProps.TaskScreenName;
          this.NowCaseName = codeTestProps.caseName;
          this.NowTestGroupID = codeTestProps.testGroupID;
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
        codeTestProps,
      });
      return "AddQueue";
    }
  }
  async codeTestSetup() {
    // MAIN.jsで呼び出される
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
        Result.caseName = this.NowCaseName;
        Result.testGroup = this.NowTestGroupID;
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
      this.runCodeTestAtCoder(next.languageId, next.code, next.codeTestProps);
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
      Object.keys(taskViewWindowApi.view).forEach((id) => {
        taskViewWindowApi.view[id].view.webContents.send(
          "LISTENER_CODETEST_STATUS_EVENT",
          res
        );
      });
    });
  }
}
export const codeTestApi = new codeTest();
