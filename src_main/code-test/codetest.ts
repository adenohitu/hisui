// AtCoder custom_testを使ったコードのテスト
//Copyright © 2021-2022 adenohitu. All rights reserved.
import { EventEmitter } from "events";
import path from "path";
import { taskViewWindowApi } from "../browser/taskviewwindow";
import { ipcMainManager } from "../ipc/ipc";
import { runLocalTest } from "./runner/local-cpp/local-tester-cpp";
import { runLocalTestPython } from "./runner/local-python/local-tester-python";
import { store } from "../save/save";
import { Atcoder } from "../data/atcoder";
import { contestDataApi } from "../data/contestdata";
import { ansCheck } from "./judgetool";
import { getDefaultLanguageinfo } from "../editor/language-tool";
import { vmDockerApi } from "../vm-system/vm-docker";
import {
  runTestWithCommand,
  runTestWithCommandArgs,
} from "./runner/command-runner/command-runner";
import { hisuiDockerJudgeCommand } from "./docker";
import { logger } from "../tool/logger/logger";
import { replaceCommanddockerExePath } from "../vm-system/docker-path";
const onlineCodeTestInterval = 30000;
export type judgeMode = "local" | "online" | "docker";
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
  compileID: number;
  onlineCodeTestLastest: number | null;

  constructor() {
    this.CodeTestEmitter = new EventEmitter();
    this.CodeTeststatus = "ready";
    this.compileID = 0;
    this.onlineCodeTestLastest = null;
    this.LISTENER_sendCodeTestStatusFinish();
  }
  async runCodeTest(
    languageId: string | number,
    code: string,
    codeTestProps: codeTestInfo,
    filepath: string,
    rootpath: string,
    mode?: string
  ) {
    // Modeで振り分け
    const getMode = mode || (store.get("judgeMode", "online") as judgeMode);
    if (getMode === "local" && languageId === "4003") {
      this.runCodeTestLocalCpp(
        languageId,
        code,
        codeTestProps,
        filepath,
        rootpath
      );
    } else if (getMode === "local" && languageId === "4006") {
      this.runCodeTestLocalPython(
        languageId,
        code,
        codeTestProps,
        filepath,
        rootpath
      );
    } else if (
      getMode === "docker" &&
      this.checkdockerContainerLanguage(languageId)
    ) {
      this.runCodeTestDocker(
        languageId,
        code,
        codeTestProps,
        filepath,
        rootpath
      );
    } else {
      // 指定のないものの場合、AtCoderCodeTestを使用する
      this.runCodeTestAtCoder(languageId, code, codeTestProps);
    }
  }
  async runCodeTestDocker(
    languageId: string | number,
    code: string,
    codeTestProps: codeTestInfo,
    filepath: string,
    rootpath: string
  ) {
    // コンテナが起動済みなのを確認
    if (
      (await vmDockerApi.getDockerHisuiJudgeContainerStatus()).status === "up"
    ) {
      // Dockerコンテナ内のパスを送信
      const outfilepath = path.join(
        rootpath,
        codeTestProps.TaskScreenName + ".out"
      );
      const testArgs: runTestWithCommandArgs = {
        preRunCommand: replaceCommanddockerExePath(
          hisuiDockerJudgeCommand[Number(languageId)].preRunCommand
        ),
        compilerCommand: replaceCommanddockerExePath(
          hisuiDockerJudgeCommand[Number(languageId)].compilerCommand
        ),
        runCommand:
          replaceCommanddockerExePath(
            hisuiDockerJudgeCommand[Number(languageId)].runCommand
          ) || "",
        filepath: filepath,
        outfilepath: outfilepath,
        codeTestIn: {
          languageId: languageId,
          code: code,
          codeTestProps: codeTestProps,
        },
      };
      this.compileID++;
      return await runTestWithCommand(
        testArgs,
        this.compileID,
        "HisuiDockerJudge"
      ).then((e) => {
        const anscheck_after = e;
        if (e.LocalCodeRunArgs.codeTestIn.codeTestProps.answer) {
          const ansstatus = ansCheck(
            e.LocalCodeRunArgs.codeTestIn.codeTestProps.answer,
            anscheck_after.Stdout
          );
          anscheck_after.answer =
            e.LocalCodeRunArgs.codeTestIn.codeTestProps.answer;
          anscheck_after.ansStatus = ansstatus;
        }
        this.CodeTestEmitter.emit("finish", anscheck_after);
      });
    } else {
      logger.info("Judge Container is not running", "codeTestApi");
      return;
    }
  }
  /**
   * コードを実行する Local C++
   */
  async runCodeTestLocalCpp(
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
    this.compileID++;
    runLocalTest(
      {
        compilerPath,
        filepath: filepath,
        outfilepath,
        codeTestIn: {
          languageId: languageId,
          code: code,
          codeTestProps: codeTestProps,
        },
      },
      this.compileID
    ).then((e) => {
      const anscheck_after = e;
      if (e.LocalCodeRunArgs.codeTestIn.codeTestProps.answer) {
        const ansstatus = ansCheck(
          e.LocalCodeRunArgs.codeTestIn.codeTestProps.answer,
          anscheck_after.Stdout
        );
        anscheck_after.answer =
          e.LocalCodeRunArgs.codeTestIn.codeTestProps.answer;
        anscheck_after.ansStatus = ansstatus;
      }
      this.CodeTestEmitter.emit("finish", anscheck_after);
    });
  }
  /**
   * コードを実行する Local Python
   */
  async runCodeTestLocalPython(
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
    const compilerPath = store.get("compilerPath.python", "python3");
    this.compileID++;
    runLocalTestPython(
      {
        compilerPath,
        filepath: filepath,
        outfilepath,
        codeTestIn: {
          languageId: languageId,
          code: code,
          codeTestProps: codeTestProps,
        },
      },
      this.compileID
    ).then((e) => {
      const anscheck_after = e;
      if (e.LocalCodeRunArgs.codeTestIn.codeTestProps.answer) {
        const ansstatus = ansCheck(
          e.LocalCodeRunArgs.codeTestIn.codeTestProps.answer,
          anscheck_after.Stdout
        );
        anscheck_after.answer =
          e.LocalCodeRunArgs.codeTestIn.codeTestProps.answer;
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
      if (
        this.onlineCodeTestLastest === null ||
        this.onlineCodeTestLastest + onlineCodeTestInterval < Date.now()
      ) {
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
            this.CodeTestchecker(codeTestProps);
            return "success";
          } else {
            this.CodeTeststatus = "ready";
            return "error:statuscode";
          }
        } catch (error) {
          logger.error("error:axiosInstance", "codeTestApi");
          return "error:axiosInstance";
        }
      } else {
        this.compileID++;
        const nowremainIntervalTime = Math.floor(
          onlineCodeTestInterval / 1000 -
            (Date.now() - this.onlineCodeTestLastest) / 1000
        );
        const createdDate = new Date().toISOString();
        const Result: atcoderCodeTestResult = {
          ansStatus: "Interval",
          Result: {
            Id: this.compileID,
            SourceCode: "",
            Input: codeTestProps.input,
            Output: "",
            Error: "",
            TimeConsumption: -1,
            MemoryConsumption: -1,
            ExitCode: -1,
            Status: -1,
            Created: createdDate,
            LanguageId: Number(languageId),
            LanguageName: getDefaultLanguageinfo(String(languageId))
              .Languagename,
          },
          Stderr: "コードテストのインターバル中です。",
          Stdout: `コードテストのインターバル中です。${nowremainIntervalTime}秒`,
          TaskScreenName: codeTestProps.TaskScreenName,
          caseName: codeTestProps.caseName,
          testGroup: codeTestProps.testGroupID,
          answer: codeTestProps.answer,
        };
        this.CodeTestEmitter.emit("finish", Result);
        return "NowInterval";
      }
    } else {
      this.compileID++;
      const createdDate = new Date().toISOString();
      const Result: atcoderCodeTestResult = {
        ansStatus: "BUSY",
        Result: {
          Id: this.compileID,
          SourceCode: "",
          Input: codeTestProps.input,
          Output: "",
          Error: "",
          TimeConsumption: -1,
          MemoryConsumption: -1,
          ExitCode: -1,
          Status: -1,
          Created: createdDate,
          LanguageId: Number(languageId),
          LanguageName: getDefaultLanguageinfo(String(languageId)).Languagename,
        },
        Stderr: "他のコードテストが実行中です",
        Stdout: "他のコードテストが実行中です",
        TaskScreenName: codeTestProps.TaskScreenName,
        caseName: codeTestProps.caseName,
        testGroup: codeTestProps.testGroupID,
        answer: codeTestProps.answer,
      };
      this.CodeTestEmitter.emit("finish", Result);
      return "busy";
    }
  }
  async codeTestSetup() {
    // MAIN.jsで呼び出される
  }
  /**
   * 結果を待機
   */
  private async CodeTestchecker(codeTestProps: codeTestInfo) {
    if (this.CodeTeststatus === "CodeTest") {
      const checkURL = `${this.getcustomTestURL()}/json?reload=true`;
      const Data = await Atcoder.axiosInstance.get(checkURL);
      // 結果に型をつける
      const Result: atcoderCodeTestResult = Data.data;
      // resultを加工
      Result.Result.Input = codeTestProps.input;

      if (Data.status === 200) {
        logger.info(
          JSON.stringify({ id: Result.Result.Id, Interval: Result.Interval }),
          "codeTestApi"
        );
        Result.TaskScreenName = codeTestProps.TaskScreenName;
        Result.caseName = codeTestProps.caseName;
        Result.testGroup = codeTestProps.testGroupID;
        if (Result["Interval"] !== undefined) {
          Result.ansStatus = "WJ";
          Result.answer = codeTestProps.answer;
          this.sendCodeTestStatus(Result);
          this.CodeTestEmitter.emit("checker", Result);
          const serf = this;
          setTimeout(() => {
            serf.CodeTestchecker(codeTestProps);
          }, Result["Interval"]);
        } else {
          if (codeTestProps.answer) {
            const ansstatus = ansCheck(codeTestProps.answer, Result.Stdout);
            Result.answer = codeTestProps.answer;
            Result["ansStatus"] = ansstatus;
          }
          this.onlineCodeTestLastest = Date.now();
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
  private checkdockerContainerLanguage(languageid: number | string) {
    const PossibleLanguageIds = [4003, 4006];
    if (PossibleLanguageIds.includes(Number(languageid))) {
      return true;
    } else {
      return false;
    }
  }
}
export const codeTestApi = new codeTest();
