const { JSDOM } = require("jsdom");
/**
 * 問題ページから全てのサンプルケースをスクレイピング
 */
export function scrapingSampleCase(body: any): {
  name: string;
  case: string;
  answer?: string;
}[] {
  const dom = new JSDOM(body);
  const TaskReamain = dom.window.document
    .querySelector("#task-statement")
    .querySelectorAll("section");

  const convertedTypeArrayTask = [].map.call(TaskReamain, (element) => {
    return element;
  });
  const Taskinput = convertedTypeArrayTask.filter((res: any) => {
    const TextTitle = res.querySelector("h3").textContent.trim();
    if (TextTitle.indexOf("入力例") !== -1) {
      return true;
    } else {
      return false;
    }
  });
  const inputList = Taskinput.map((res: any) => {
    const sampleNameBefore = res.querySelector("h3").textContent;
    const SampleIndex = sampleNameBefore.indexOf("例") + 1;
    const SampleName = sampleNameBefore.slice(SampleIndex).trim();
    const Sample = res.querySelector("pre")?.textContent;
    return { name: SampleName, case: Sample };
  });
  const Taskanswer = convertedTypeArrayTask.filter((res: any) => {
    const TextTitle = res.querySelector("h3").textContent.trim();
    if (TextTitle.indexOf("出力例") !== -1) {
      return true;
    } else {
      return false;
    }
  });
  const answerList = Taskanswer.map((res: any) => {
    const sampleNameBefore = res.querySelector("h3").textContent;
    const SampleIndex = sampleNameBefore.indexOf("例") + 1;
    const SampleName = sampleNameBefore.slice(SampleIndex).trim();
    const Sample = res.querySelector("pre")?.textContent;
    return { name: SampleName, answer: Sample };
  });
  const returnData = inputList.map((ele) => {
    const ans = answerList.find((element) => element.name === ele.name);
    if (ans) {
      return {
        name: ele.name,
        case: ele.case,
        answer: ans.answer,
      };
    } else {
      return {
        name: ele.name,
        case: ele.case,
      };
    }
  });
  return returnData;
}
