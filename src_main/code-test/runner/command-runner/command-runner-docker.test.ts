import { readFile } from "fs/promises";
import path from "path";
import { vmDockerApi } from "../../../vm-system/vm-docker";
import { runTestWithCommand, runTestWithCommandArgs } from "./command-runner";
jest.setTimeout(100000);
// コンテナの起動
beforeAll(async () => {
  return await vmDockerApi.startDockerHisuiJudge();
});

// afterAll(async () => {
//   return await vmDockerApi.stopDockerHisuiJudge();
// });
test("runTest with Command by Docker", async () => {
  const filepath = path.join(
    __dirname,
    "../../../../archive/test-data/abc164_b/b.cpp"
  );
  const outfilepath = path.join(
    __dirname,
    "../../../../archive/test-data/abc164_b/b.out"
  );
  const inputFiledir = path.join(
    __dirname,
    "../../../../archive/test-data/abc164_b/sample/1.in"
  );
  const input = await readFile(inputFiledir, "utf-8");
  const outputFiledir = path.join(
    __dirname,
    "../../../../archive/test-data/abc164_b/sample/1.out"
  );
  const output = await readFile(outputFiledir, "utf-8");

  const testArgs: runTestWithCommandArgs = {
    preRunCommand: "docker cp {filepath} hisui-judge-docker:/home/cpp/a.cpp",
    compilerCommand:
      "docker exec hisui-judge-docker g++ -std=gnu++17 -Wall -Wextra -O2 -DONLINE_JUDGE -o /home/cpp/a.out /home/cpp/a.cpp",
    runCommand: "docker exec -i hisui-judge-docker /home/cpp/a.out",
    filepath: filepath,
    outfilepath: outfilepath,
    codeTestIn: {
      languageId: "4003",
      code: "",
      codeTestProps: {
        input: input,
        answer: null,
        caseName: "1",
        testGroupID: "view-button:/contests/abc164/tasks/abc164_b",
        TaskScreenName: "abc164_b",
      },
    },
  };
  const data = await runTestWithCommand(testArgs, 1, "docker");

  expect(data.Stdout).toEqual(output);
});
