// /contests/contestname/submitをスクレイピング
// issue #15 を参照
const { JSDOM } = require("jsdom");
//問題ごとの提出可能言語を取得
export interface submitLanguage {
  LanguageId: string;
  Languagename: string;
}
export interface scrapingLangReturn {
  taskScreenName: string;
  Taskname: string;
  submitlangList: submitLanguage[];
}

export async function scrapingSubmitlang(
  body: any
): Promise<scrapingLangReturn[]> {
  const dom = new JSDOM(body);

  const tasklistBefore = dom.window.document.querySelector("#select-task");
  const taskAll = tasklistBefore.querySelectorAll("option");
  const returnData = Array.from(taskAll).map((element: any) => {
    const Taskname: string = element.textContent.trim();
    const taskScreenName: string = element.getAttribute("value");
    const taskLang_dom = dom.window.document.querySelector(
      `#select-lang-${taskScreenName}`
    );
    const submitlangAll = taskLang_dom.querySelectorAll("option");
    const submitlangList = Array.from(submitlangAll)
      .map((element2: any) => {
        const Languagename: string = element2.textContent.trim();
        const LanguageId: string = element2.getAttribute("value");
        return { LanguageId, Languagename };
      })
      .filter((word) => word.LanguageId !== null);

    return { taskScreenName, Taskname, submitlangList };
  });
  return returnData;
}
