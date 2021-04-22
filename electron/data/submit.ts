// 提出に関するモジュール
import { Atcoder } from "./atcoder";
import { scrapingSubmitlang } from "./scraping/submitlang";
const baseUrlAtCoderContest = "https://atcoder.jp/contests/";

/**
 * コンテストの提出ページから、提出可能な言語を取得
 */
export const getSubmitLangOption = async (contestid: string) => {
  const responce = await Atcoder.axiosInstance.get(
    `${baseUrlAtCoderContest}${contestid}/submit`
  );
  const submitLangalist = await scrapingSubmitlang(responce.data);
  return submitLangalist;
};

/**
 * コードを提出する
 */
export const submit = async (
  contestid: string,
  taskScreenName: string,
  code: string,
  LanguageId: any
) => {
  //空文字判定
  if (!code) {
    return "CodeisEmpty";
  } else {
    const submitUrl = `${baseUrlAtCoderContest}${contestid}/submit`;
    const csrfToken = await Atcoder.get_csrf(true, submitUrl);
    const params = new URLSearchParams();
    params.append("data.TaskScreenName", taskScreenName);
    params.append("data.LanguageId", LanguageId);
    params.append("sourceCode", code);
    params.append("csrf_token", csrfToken[0]);
    const postResponce = await Atcoder.axiosInstance
      .post(submitUrl, params, {
        maxRedirects: 0,
        validateStatus: (status) =>
          (status >= 200 && status < 300) || status === 302,
      })
      .then((responce: any) => {
        console.log(responce);
        if (responce.status === 302) {
          return "success";
        }
      })
      .catch((err: any) => {
        console.log(err);
        return "Failure_requestError";
      });
    return postResponce;
  }
};