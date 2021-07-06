// /contests/contestname/submitをスクレイピング
// issue #15 を参照
const { JSDOM } = require("jsdom");
//問題ごとの提出可能言語を取得
export interface lang {
  taskScreenName: string;
  Languagename: string;
  LanguageId: number;
}

export async function scrapingSubmitlang(body: any) {
  const dom = new JSDOM(body);

  const tasklistBefore = dom.window.document.querySelector("#select-task");
  const taskAll = tasklistBefore.querySelectorAll("option");
  const taskAllList = [].map.call(taskAll, (element: any) => {
    const Taskname = element.textContent.trim();
    const taskScreenName = element.getAttribute("value");
    return { taskScreenName, Taskname };
  });

  const taskLang: any = [].map.call(taskAllList, (element: any) => {
    const taskLang_dom = dom.window.document.querySelector(
      `#select-lang-${element.taskScreenName}`
    );
    const submitlangAll = taskLang_dom.querySelectorAll("option");
    const submitlangList = [].map.call(submitlangAll, (element2: any) => {
      const Languagename = element2.textContent.trim();
      const LanguageId = element2.getAttribute("value");
      return { LanguageId, Languagename };
    });
    return {
      taskScreenName: element.taskScreenName,
      Taskname: element.Taskname,
      submitlangList,
    };
  });

  return taskLang;
}
