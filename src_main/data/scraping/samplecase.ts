const { JSDOM } = require("jsdom");
/**
 * 問題ページから全てのサンプルケースをスクレイピング
 */
export function scrapingSampleCase(body: any) {
  const dom = new JSDOM(body);
  const TaskReamain = dom.window.document
    .querySelector("#task-statement")
    .querySelectorAll("section");

  const convertedTypeArrayTask = [].map.call(TaskReamain, (element) => {
    return element;
  });
  const TaskResult = convertedTypeArrayTask.filter((res: any) => {
    const TextTitle = res.querySelector("h3").textContent.trim();
    if (TextTitle.indexOf("入力例") !== -1) {
      return true;
    } else {
      return false;
    }
  });
  return TaskResult.map((res: any) => {
    const sampleNameBefore = res.querySelector("h3").textContent;
    const SampleIndex = sampleNameBefore.indexOf("例") + 1;

    const SampleName = sampleNameBefore.slice(SampleIndex).trim();
    const Sample = res.querySelector("pre")?.textContent;
    return { name: SampleName, case: Sample };
  });
}
