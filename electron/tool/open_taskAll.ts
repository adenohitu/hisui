// import { Atcoder } from "../data/atcoder";
import urlOpen from "./openExternal";
import { getContestID, get_Score } from "../data/contestData";
async function openTaskAll() {
  const contestId: any = await getContestID();
  const data: any = await get_Score(contestId);
  console.log(data);

  for (let i = 0; i < data.length; i++) {
    const url = `https://atcoder.jp/contests/${contestId}/tasks/${data[i].TaskScreenName}`;
    await urlOpen(url);
  }
}
export default openTaskAll;
