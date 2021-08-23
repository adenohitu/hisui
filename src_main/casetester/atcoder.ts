import { EventEmitter } from "stream";
import { Atcoder } from "../data/atcoder";
import { contestDataApi } from "../data/contestdata";
import { languagetype, submitLanguageId } from "../file/extension";
type codeTestStatus = any;
/**
 * コードテストが実行されたときに発生するイベント
 */
export declare class CodeTestEmitter extends EventEmitter {
  on(event: "run", listener: () => void): this;
  once(event: "run", listener: () => void): this;
  emit(event: "run"): boolean;

  on(event: "finish", listener: (status: any) => void): this;
  once(event: "finish", listener: (status: any) => void): this;
  emit(event: "finish", status: codeTestStatus): boolean;
}

class atcoderCodeTest {
  CodeTestEmitter: CodeTestEmitter;
  CodeTeststatus: "CodeTest" | "ready";
  constructor() {
    this.CodeTestEmitter = new EventEmitter();
    this.CodeTeststatus = "ready";
  }
  /**
   * コードを実行する
   */
  async runCodeTest(lang: languagetype, code: string, input: string) {
    if (this.CodeTeststatus === "ready") {
      const customTestPostURL = `${this.getcustomTestURL()}/submit/json`;
      const csrf_token = await Atcoder.getCsrftoken(
        true,
        this.getcustomTestURL()
      );

      const params = new URLSearchParams();
      params.append("data.LanguageId", String(submitLanguageId[lang]));
      params.append("sourceCode", code);
      params.append("input", input);
      params.append("csrf_token", csrf_token[0]);

      const res = await Atcoder.axiosInstance.post(customTestPostURL, params, {
        maxRedirects: 0,
        validateStatus: (status) =>
          (status >= 200 && status < 300) || status === 302,
      });

      if (res.status === 200) {
        this.CodeTestEmitter.emit("run");
        this.CodeTeststatus = "CodeTest";
        this.CodeTestchecker();
      }
    }
  }
  /**
   * 結果を待機
   */
  private async CodeTestchecker() {
    if (this.CodeTeststatus === "CodeTest") {
      const checkURL = `${this.getcustomTestURL()}/json?reload=true`;
      console.log(checkURL);

      const Data = await Atcoder.axiosInstance.get(checkURL);

      if (Data.status === 200) {
        if (Data.data["Interval"] !== undefined) {
          var serf = this;
          setTimeout(() => {
            serf.CodeTestchecker();
          }, Data.data["Interval"]);
        } else {
          this.CodeTestEmitter.emit("finish", Data.data["Result"]);
          this.CodeTeststatus = "ready";
        }
      }
    }
  }
  /**
   * コードテストのページのURLを取得
   * @returns https://atcoder.jp/contests/${contestid}/custom_test
   */
  private getcustomTestURL() {
    const contestid = contestDataApi.getDefaultContestID();
    return `https://atcoder.jp/contests/${contestid}/custom_test`;
  }
}
export const atcoderCodeTestApi = new atcoderCodeTest();
