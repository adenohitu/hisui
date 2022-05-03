import { readFile } from "fs/promises";
import path from "path";
import { LocalCodeRunArgs, runLocalTestPython } from "./local-tester-python";

test("Local Judge Test: command Error", async () => {
  const filepath = path.join(
    __dirname,
    "../../../archive/test-data/abc164_a/a.py"
  );
  const outfilepath = path.join(
    __dirname,
    "../../../archive/test-data/abc164_a/a.py"
  );
  const inputFiledir = path.join(
    __dirname,
    "../../../archive/test-data/abc164_a/sample/1.in"
  );
  const input = await readFile(inputFiledir, "utf-8");
  const outputFiledir = path.join(
    __dirname,
    "../../../archive/test-data/abc164_a/sample/1.out"
  );
  const output = await readFile(outputFiledir, "utf-8");
  const testArgs: LocalCodeRunArgs = {
    compilerPath: "python3",
    filepath: filepath,
    outfilepath: outfilepath,
    codeTestIn: {
      languageId: "4006",
      code: "",
      codeTestProps: {
        input: input,
        answer: null,
        caseName: "1",
        testGroupID: "view-button:/contests/abc164/tasks/abc164_b",
        TaskScreenName: "abc164_a",
      },
    },
  };
  const data = await runLocalTestPython(testArgs);
  expect(data.Stdout).toEqual(output);
});

test("Local Judge Test", async () => {
  const filepath = path.join(
    __dirname,
    "../../../archive/test-data/abc164_a/a.py"
  );
  const outfilepath = path.join(
    __dirname,
    "../../../archive/test-data/abc164_a/a.py"
  );
  const inputFiledir = path.join(
    __dirname,
    "../../../archive/test-data/abc164_a/sample/1.in"
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
        TaskScreenName: "abc164_a",
      },
    },
  };
  const data = await runLocalTestPython(testArgs);
  expect(data.Stderr).toEqual("ProcessError");
  expect(data.Result.ExitCode).toEqual(-1);
});
