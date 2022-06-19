import { spawn } from "child_process";
import { atcoderCodeTestResult, codeTestIn } from "../../codetest";
import { logger } from "../../../tool/logger/logger";
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

export function runLocalTestPython(args: LocalCodeRunArgs, compileID: number) {
  return new Promise<LocalCodeTest>((resolve) => {
    const createdDate = new Date().toISOString();
    try {
      // 出力保持用
      let stdout = "";
      let stdError = "";
      const runner = spawn(args.compilerPath, [args.filepath], {
        timeout: 5000,
      });
      runner.stdin.write(args.codeTestIn.codeTestProps.input);
      runner.stdout.on("data", (rawData) => {
        const data = rawData.toString("utf-8");
        stdout = data;
      });
      runner.on("error", (err) => {
        stdError = err.message;
      });
      runner.on("close", (code) => {
        logger.info(`Run CODE: ${code}`, "Python Tester");

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
            TimeConsumption: (code === null && 5000) || -1,
            MemoryConsumption: -1,
            ExitCode,
            Status: 0,
            // ISO 8601
            Created: createdDate,
            LanguageId: 4006,
            LanguageName: "Python (local)",
          },
          Stderr: stdError,
          Stdout: stdout,
        });
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
          LanguageId: 4006,
          LanguageName: "Python (local)",
        },
        Stderr: "ProcessError",
        Stdout: "ProcessError",
      });
      logger.error(errorMessage.message);
    }
  });
}
