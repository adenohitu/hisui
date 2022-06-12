import fs from "fs/promises";
import path from "path";
import { scraping_submitData } from "../../submit-data";
async function runTasklist(filename: string) {
  const get = await fs.readFile(path.join(__dirname, filename), "utf-8");
  const returndata = scraping_submitData(JSON.parse(get));
  return returndata;
}
const filelist = ["1_wj.json", "2_tle.json", "3_ac.json"];
filelist.forEach(async (name) => {
  test("scraping submit Status", async () => {
    const data = await runTasklist(name);
    console.log(data);
    //   expect(data).toStrictEqual(ans);
  });
});
