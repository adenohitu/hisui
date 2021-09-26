import axios from "axios";
import { scrapingSampleCase } from "./samplecase";
export async function runTasklist() {
  const get = await axios.get(
    `https://atcoder.jp/contests/abc200/tasks/abc200_c`
  );
  const returndata = scrapingSampleCase(get.data);
  console.log(returndata);
}
runTasklist();
