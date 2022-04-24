import { spawn } from "child_process";
import fse from "fs-extra";
import { atcoderCodeTestResult, codeTestIn } from "../data/code-test/codetest";
import { logger } from "../tool/logger/logger";
let compileID = 0;
// import { codeTestIn } from "../data/casetester/runtest_atcoder";
// "cpp": "cd $dir && /usr/local/bin/g++ $fileName -D=__LOCAL -o $fileNameWithoutExt && $dir$fileNameWithoutExt"
// g++ -std=gnu++17 -Wall -Wextra -O2 -DONLINE_JUDGE -I/opt/boost/gcc/include -L/opt/boost/gcc/lib -I/opt/ac-library -o {dirname}/a.out {dirname}/{basename}
export interface LocalCodeRunArgs {
  compilerPath: string;
  filepath: string;
  outfilepath: string;
  codeTestIn: codeTestIn;
}
export interface LocalCodeTest extends atcoderCodeTestResult {
  LocalCodeRunArgs: LocalCodeRunArgs;
}

export function runLocalTest(args: LocalCodeRunArgs) {
  return new Promise<LocalCodeTest>((resolve) => {
    const createdDate = new Date().toISOString();
    compileID++;
    try {
      fse.remove(args.outfilepath);
      const compile = spawn(args.compilerPath, [
        args.filepath,
        "-o",
        args.outfilepath,
        "-std=gnu++17",
        "-Wall",
        "-Wextra",
        "-O2",
        "-DONLINE_JUDGE",
      ]);
      let conpileStdError = "";
      // compile.stdout.on("data", (data) => {
      //   console.log("STDOUT", data.toString()); // Stream
      // });
      compile.stderr.on("data", (data) => {
        conpileStdError = data.toString();
        console.log(data.toString());
      });
      compile.on("close", async (code) => {
        console.log("Conpile CODE", code);
        const ExitCode = code || -1;
        if (!(await fse.pathExists(args.outfilepath))) {
          resolve({
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
              ExitCode,
              Status: 3,
              Created: createdDate,
              LanguageId: 4003,
              LanguageName: "C++ (Local)",
            },
            Stderr: conpileStdError,
            Stdout: "",
          });
        }
      });
      compile.on("close", async () => {
        // 出力保持用
        let stdout = "";
        let stdError = "";
        if (await fse.pathExists(args.outfilepath)) {
          const runner = spawn(args.outfilepath, { timeout: 5000 });
          runner.stdin.write(args.codeTestIn.codeTestProps.input);
          runner.stdout.on("data", (rawData) => {
            const data = rawData.toString("utf-8");
            stdout = data;
          });
          runner.on("error", (err) => {
            stdError = err.message;
          });
          runner.on("close", (code) => {
            const ExitCode = code || -1;
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
                TimeConsumption: -1,
                MemoryConsumption: -1,
                ExitCode,
                Status: 0,
                // ISO 8601
                Created: createdDate,
                LanguageId: 4001,
                LanguageName: "c++ (Local)",
              },
              Stderr: stdError,
              Stdout: stdout,
            });
          });
        }
      });
    } catch (e: any) {
      const errorMessage: Error = e;
      resolve({
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
          LanguageId: 4003,
          LanguageName: "C++ (Local)",
        },
        Stderr: "コンパイラーのパスが正しくしてされていない可能性があります。",
        Stdout: "",
      });
      logger.error(errorMessage.message);
    }
  });
}
