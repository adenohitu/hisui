import { scrapingTaskList } from "./tasklist";
import axios from "axios";
async function runTasklist() {
  const get = await axios.get(`https://atcoder.jp/contests/abc197/tasks`);
  const returndata = await scrapingTaskList(get.data);
  //   console.log(get);

  console.log(returndata);
}
runTasklist();
