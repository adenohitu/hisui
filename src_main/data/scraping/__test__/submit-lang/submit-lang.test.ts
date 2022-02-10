import fs from "fs/promises";
import { scrapingSubmitlang } from "../../submitlang";
async function runTasklist() {
  const get = await fs.readFile(__dirname + "/test.html", "utf-8");
  const ansJson = await fs.readFile(__dirname + "/ans.json", "utf-8");
  const ans = await JSON.parse(ansJson);
  const returndata = await scrapingSubmitlang(get);
  return { ans, returndata };
}
test("scraping submissions", async () => {
  const data = await runTasklist();
  expect(data.returndata).toEqual(data.ans);
});
