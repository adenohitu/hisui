import fs from "fs/promises";
import scraping_submissions_list from "../../submissions";
async function runTasklist() {
  const get = await fs.readFile(__dirname + "/test.html", "utf-8");
  const returndata = scraping_submissions_list(get, "abc200");
  return returndata;
}
const ans = [
  { name: "1", case: "6\n123 223 123 523 200 2000\n", answer: "4\n" },
  { name: "2", case: "5\n1 2 3 4 5\n", answer: "0\n" },
  { name: "3", case: "8\n199 100 200 400 300 500 600 200\n", answer: "9\n" },
];
test("scraping submissions", async () => {
  const data = await runTasklist();
  console.log(data);
  expect(data).toStrictEqual(ans);
});
