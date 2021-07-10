// import { Atcoder } from "../data/atcoder";
import urlOpen from "./openExternal";
import { contestDataApi } from "../data/contestdata";
import { submissionsApi } from "../data/submissions";
async function openTaskAll() {
  const contestId = contestDataApi.getDefaultContestID();
  const data: any = await submissionsApi.getContestScore(contestId);
  console.log(data);

  for (let i = 0; i < data.length; i++) {
    const url = `https://atcoder.jp/contests/${contestId}/tasks/${data[i].TaskScreenName}`;
    await urlOpen(url);
  }
}
export default openTaskAll;
