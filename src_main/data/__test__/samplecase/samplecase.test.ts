import fs from "fs/promises";
import { scrapingSampleCase } from "../../scraping/samplecase";
async function runTasklist() {
  const get = await fs.readFile(__dirname + "/test.html", "utf-8");
  const returndata = scrapingSampleCase(get);
  return returndata;
}
const ans = [
  { name: "1", case: "6\n123 223 123 523 200 2000\n", answer: "4\n" },
  { name: "2", case: "5\n1 2 3 4 5\n", answer: "0\n" },
  { name: "3", case: "8\n199 100 200 400 300 500 600 200\n", answer: "9\n" },
];
test("scraping SampleCase", async () => {
  const data = await runTasklist();
  expect(data).toStrictEqual(ans);
});
