import { readFile } from "fs/promises";
import path from "path";
import { LocalCodeRunArgs, runLocalTest } from "./local-tester-cpp";
jest.setTimeout(20000);
test("Local Judge Test: pathError", async () => {
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
  const testArgs: LocalCodeRunArgs = {
    compilerPath: "g++",
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
  const data = await runLocalTest(testArgs, 1);
  expect(data.Stdout).toEqual(output);
});

test("Local Judge Test", async () => {
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

  const testArgs: LocalCodeRunArgs = {
    compilerPath: "",
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
  const data = await runLocalTest(testArgs, 1);
  expect(data.Stderr).toEqual(
    "コンパイラーのパスが正しくしてされていない可能性があります。"
  );
  expect(data.Result.ExitCode).toEqual(-1);
});
