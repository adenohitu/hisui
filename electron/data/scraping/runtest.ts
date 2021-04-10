import axios from "axios";
import { scrapingUserData } from "./userdata";
async function runTasklist() {
  const get = await axios.get(`https://atcoder.jp/users/tourist?lang=ja`);
  const returndata = await scrapingUserData(get.data);
  //   console.log(get);

  console.log(returndata);
}
runTasklist();
