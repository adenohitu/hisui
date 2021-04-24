// import { Atcoder } from "../data/atcoder";
import urlOpen from "./openExternal";
import { getDefaultContestID, getContestScore } from "../data/contestdata";
async function openTaskAll() {
  const contestId: any = await getDefaultContestID();
  const data: any = await getContestScore(contestId);
  console.log(data);

  for (let i = 0; i < data.length; i++) {
    const url = `https://atcoder.jp/contests/${contestId}/tasks/${data[i].TaskScreenName}`;
    await urlOpen(url);
  }
}
export default openTaskAll;
