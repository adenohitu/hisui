// コマンドでローカルのコンパイラー等を使用して、コードテストを実行する
// パイプを使用するため、shell:true
// https://github.com/nodejs/node/issues/7367
// https://github.com/nodejs/node-v0.x-archive/issues/25895
import { exec, spawn } from "child_process";
import { atcoderCodeTestResult, codeTestIn } from "../../codetest";
import { logger } from "../../../tool/logger/logger";
import { languages } from "../../../file/extension";
// import { codeTestIn } from "../data/casetester/runtest_atcoder";
// "cpp": "cd $dir && /usr/local/bin/g++ $fileName -D=__LOCAL -o $fileNameWithoutExt && $dir$fileNameWithoutExt"
// g++ -std=gnu++17 -Wall -Wextra -O2 -DONLINE_JUDGE -I/opt/boost/gcc/include -L/opt/boost/gcc/lib -I/opt/ac-library -o {outfilepath} {filepath}
export interface runTestWithCommandArgs {
  preRunCommand: string | null;
  compilerCommand: string | null;
  skipCompile?: boolean;
  runCommand: string;
  filepath: string;
  // コンパイルの出力先
  outfilepath: string;
  codeTestIn: codeTestIn;
}
export interface LocalCodeTestResult extends atcoderCodeTestResult {
  LocalCodeRunArgs: runTestWithCommandArgs;
}

export async function runTestWithCommand(
  args: runTestWithCommandArgs,
  compileID: number,
  toolName: string
): Promise<LocalCodeTestResult> {
  const createdDate = new Date().toISOString();

  const preRun = await preRunCommand(args, compileID, createdDate);
  if (preRun.status !== "preRunError") {
    return new Promise<LocalCodeTestResult>((resolve) => {
      if (!args.skipCompile && args.compilerCommand !== null) {
        try {
          // コンパイル
          const replacedCommand = commandReplace(
            args.compilerCommand,
            args.outfilepath,
            args.filepath
          );
          const compile = spawn(replacedCommand, { shell: true });
          let conpileStdError = "";
          compile.stdout.on("data", (data) => {
            conpileStdError += data.toString();
            logger.info(`STDOUT:${data.toString()}`, "commad Tester");
          });
          compile.stderr.on("data", (data) => {
            conpileStdError += data.toString();
            logger.info(`STDERR:${data.toString()}`, "commad Tester");
          });
          compile.on("close", async (code) => {
            logger.info(`Conpile CODE: ${code}`, "commad Tester");
            let ExitCode = -1;
            if (code === 0) {
              ExitCode = 0;
            } else {
              resolve({
                LocalCodeRunArgs: args,
                caseName: args.codeTestIn.codeTestProps.caseName,
                testGroup: args.codeTestIn.codeTestProps.testGroupID,
                ansStatus: "CE",
                Result: {
                  Id: compileID,
                  SourceCode: "",
                  Input: args.codeTestIn.codeTestProps.input,
                  Output: "",
                  Error: "",
                  TimeConsumption: -1,
                  MemoryConsumption: -1,
                  ExitCode,
                  Status: 3,
                  Created: createdDate,
                  LanguageId: Number(args.codeTestIn.languageId),
                  LanguageName:
                    Object.keys(languages).find((e) => {
                      return (
                        languages[e].submitLanguageId ===
                        Number(args.codeTestIn.languageId)
                      );
                    }) + ` (${toolName})` || `CommandRunner (${toolName})`,
                },
                Stderr: conpileStdError,
                Stdout: "",
              });
            }
          });
          compile.on("close", () => {
            runTest(args, compileID, createdDate, toolName).then((result) => {
              resolve(result);
            });
          });
          // 実行
        } catch (e: any) {
          const errorMessage: Error = e;
          resolve({
            LocalCodeRunArgs: args,
            caseName: args.codeTestIn.codeTestProps.caseName,
            testGroup: args.codeTestIn.codeTestProps.testGroupID,
            ansStatus: "CE",
            Result: {
              Id: compileID,
              SourceCode: "",
              Input: args.codeTestIn.codeTestProps.input,
              Output: "",
              Error: "",
              TimeConsumption: -1,
              MemoryConsumption: -1,
              ExitCode: -1,
              Status: 3,
              Created: createdDate,
              LanguageId: Number(args.codeTestIn.languageId),
              LanguageName:
                Object.keys(languages).find((e) => {
                  return (
                    languages[e].submitLanguageId === args.codeTestIn.languageId
                  );
                }) + ` (${toolName})` || `CommandRunner (${toolName})`,
            },
            Stderr:
              "コンパイラーのパスが正しくしてされていない可能性があります。",
            Stdout: "",
          });
          logger.error(errorMessage.message);
        }
      } else {
        runTest(args, compileID, createdDate, toolName).then((result) => {
          resolve(result);
        });
      }
    });
  } else {
    // preRunに失敗
    return {
      LocalCodeRunArgs: args,
      ansStatus: "CE",
      Result: {
        Id: compileID,
        SourceCode: "",
        Input: args.codeTestIn.codeTestProps.input,
        Output: "",
        Error: "",
        TimeConsumption: -1,
        MemoryConsumption: -1,
        ExitCode: -1,
        Status: 3,
        Created: createdDate,
        LanguageId: Number(args.codeTestIn.languageId),
        LanguageName:
          Object.keys(languages).find((e) => {
            return (
              languages[e].submitLanguageId ===
              Number(args.codeTestIn.languageId)
            );
          }) + ` (${toolName})` || `CommandRunner (${toolName})`,
      },
      Stderr: "PreRunに失敗しました",
      Stdout: "",
    };
  }
}
/**
 * コンパイル前に実行する
 */
async function preRunCommand(
  args: runTestWithCommandArgs,
  compileID: number,
  createdDate: string
): Promise<{
  status: "skip" | "success" | "preRunError";
  stdout?: string;
}> {
  if (args.preRunCommand !== null) {
    const replacedCommand = commandReplace(
      args.preRunCommand,
      args.outfilepath,
      args.filepath
    );
    const run = await new Promise<{
      status: "success" | "preRunError";
      stdout?: string;
    }>((resolve) => {
      // パイプを使用するため、shell:true
      exec(replacedCommand, (error, stdout, stderr) => {
        if (error) {
          console.log(error);
          resolve({ status: "preRunError", stdout: stderr });
        } else {
          resolve({ status: "success", stdout: stdout });
        }
      });
    });
    return run;
  } else {
    return { status: "skip" };
  }
}
function runTest(
  args: runTestWithCommandArgs,
  compileID: number,
  createdDate: string,
  toolName: String
): Promise<LocalCodeTestResult> {
  return new Promise((resolve) => {
    // 出力保持用
    let stdout = "";
    let stdError = "";
    const replacedCommand = commandReplace(
      args.runCommand,
      args.outfilepath,
      args.filepath
    );
    // 実行開始時間を記録
    const startTime = performance.now();
    const runner = spawn(replacedCommand, {
      shell: true,
      timeout: 10000,
    });
    runner.stdin.write(args.codeTestIn.codeTestProps.input);

    runner.stdout.on("data", (rawData) => {
      const data = rawData.toString("utf-8");
      logger.info(`STDOUT: ${data}`, "commad Tester");
      stdout = data;
    });
    runner.on("error", (err) => {
      logger.info(`STDERR: ${err.message}`, "commad Tester");
      stdError += err.message;
    });
    runner.on("close", (code) => {
      logger.info(`Run CODE: ${code}`, "commad Tester");

      let ExitCode = -1;
      if (code === 0) {
        ExitCode = 0;
      } else if (code === null) {
        ExitCode = -1;
      } else {
        ExitCode = code;
      }
      resolve({
        LocalCodeRunArgs: args,
        caseName: args.codeTestIn.codeTestProps.caseName,
        testGroup: args.codeTestIn.codeTestProps.testGroupID,
        Result: {
          Id: compileID,
          SourceCode: "",
          Input: args.codeTestIn.codeTestProps.input,
          Output: "",
          Error: "",
          TimeConsumption: Math.floor(performance.now() - startTime),
          MemoryConsumption: -1,
          ExitCode,
          Status: 0,
          // ISO 8601
          Created: createdDate,
          LanguageId: Number(args.codeTestIn.languageId),
          LanguageName:
            Object.keys(languages).find((e) => {
              return (
                languages[e].submitLanguageId ===
                Number(args.codeTestIn.languageId)
              );
            }) + ` (${toolName})` || `CommandRunner (${toolName})`,
        },
        Stderr: stdError,
        Stdout: stdout,
      });
    });
  });
}
function commandReplace(
  command: string,
  outfilepath: string,
  filepath: string
) {
  return command
    .replace("{outfilepath}", outfilepath)
    .replace("{filepath}", filepath);
}
