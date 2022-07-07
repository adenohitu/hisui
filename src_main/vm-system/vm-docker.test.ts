import { vmDockerApi } from "./vm-docker";
jest.setTimeout(1000000);
test("vmApi Test", async () => {
  // expect(data.Stdout).toEqual(output);
  const getlog = await vmDockerApi.checkDockerInstalled();
  console.log(getlog);
});

// 並列実行によりcommand-runner-docker.test.tsと干渉する

// test("docker Run Test", async () => {
//   const startDocker = await vmDockerApi.startDockerHisuiJudge();
//   console.log(startDocker);
//   const getlog = await vmDockerApi.getDockerHisuiJudgeContainerStatus();
//   console.log(getlog);
//   const stopDockerlast = await vmDockerApi.stopDockerHisuiJudge();
//   console.log(stopDockerlast);
//   const getlog2 = await vmDockerApi.getDockerHisuiJudgeContainerStatus();
//   console.log(getlog2);
// });
