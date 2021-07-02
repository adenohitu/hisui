import { Atcoder } from "../atcoder";
import { scrapingSubmitlang } from "./submitlang";
export async function runTasklist() {
  const get = await Atcoder.axiosInstance.get(
    `https://atcoder.jp/contests/arc117/submit`
  );
  const returndata = await scrapingSubmitlang(get.data);
  //   console.log(get);
  console.dir(returndata);
}
