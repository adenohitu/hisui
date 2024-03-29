// 提出に関するモジュール
import { Atcoder } from "./atcoder";
import { scrapingSubmitlang } from "./scraping/submitlang";
import { returnSubmit } from "../interfaces";
import { hisuiEvent } from "../event/event";
import { ipcMainManager } from "../ipc/ipc";
import { submissionsApi } from "./submissions";
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
export const SetIPCgetSubmitLangOption = () => {
  ipcMainManager.handle(
    "GET_SUBMIT_LANGUAGE_LIST",
    async (e, contestid: string) => {
      const data = await getSubmitLangOption(contestid);
      return data;
    }
  );
};
/**
 * コードを提出する
 */
export async function runSubmit(
  contestid: string,
  taskScreenName: string,
  code: string,
  LanguageId: any
): Promise<returnSubmit> {
  //空文字判定
  if (!code) {
    return "CodeisEmpty";
  } else {
    const submitUrl = `${baseUrlAtCoderContest}${contestid}/submit`;
    const csrfToken = await Atcoder.getCsrftoken(true, submitUrl);
    const params = new URLSearchParams();
    params.append("data.TaskScreenName", taskScreenName);
    params.append("data.LanguageId", LanguageId);
    params.append("sourceCode", code);
    params.append("csrf_token", csrfToken[0]);
    const postResponce: any = await Atcoder.axiosInstance
      .post(submitUrl, params, {
        maxRedirects: 0,
        validateStatus: (status) =>
          (status >= 200 && status < 300) || status === 302,
      })
      .then((responce) => {
        console.log("runsubmit");
        if (responce.status === 302) {
          // 提出イベントを発行
          hisuiEvent.emit("submit", taskScreenName);
          submissionsApi.submitCheck(contestid);
          return "success";
        } else {
          ipcMainManager.send(
            "SEND_NOTIFICARION",
            "提出に失敗しました。（提出制限がかかっている可能性があります）"
          );
          return "submit_error";
        }
      })
      .catch((err) => {
        console.log(err);
        return "Failure_requestError";
      });
    return postResponce;
  }
}
