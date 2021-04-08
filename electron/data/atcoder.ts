//atcoderとの通信用クラス
//ログインや通信を管理
//Copyright © 2021 adenohitu. All rights reserved.
import axios, { AxiosInstance } from "axios";
// import { log } from "console";
// import { store } from "../save/save";

import { save_session } from "../save/save_session";

// import { store } from "../save/save";

const url_login: string = "https://atcoder.jp/login";
/**
 * atcoderにアクセスする
 */
class AtcoderClass {
  //AxiosInstanceを作成
  axiosInstance: AxiosInstance = axios.create({
    headers: { Cookie: save_session.get("session", "") },
  });
  setup() {
    this.axiosInstance.interceptors.request.use((request) => {
      console.log("Starting Request: ", request.url);
      return request;
    });
  }
  constructor() {
    this.setup();
  }
  // CheckSession: boolean;
  // SetContestID: string = store.get("SetContestID", "abc001");

  /**
   * セッションを使いログインされているかをチェック
   * 一時的にTrueにしてる
   * @return {boolean}
   */
  async check_login() {
    const test_url = "https://atcoder.jp/contests/abc189/submit";
    // if (this.CheckSession !== true) {
    const status = await save_session.get(
      "checkLastest",
      Date.now() + 86400001
    );
    const ID = await save_session.get("ID");
    const now = Date.now();
    //前回ログイン成功時の時間を使いリクエスト回数を減らす
    if (ID === undefined) {
      console.log("checklogin-notsetID");
      return false;
    } else if (status > now + 86400000) {
      console.log("checklogin-req");
      return await this.axiosInstance
        .get(test_url, {
          maxRedirects: 0,
          validateStatus: (status) =>
            (status >= 200 && status < 300) || status === 302,
        })
        .then((responce) => {
          if (responce.status !== 302) {
            // You have already login.
            save_session.set("checkLastest", Date.now());
            return true;
          } else {
            return false;
          }
        });
    } else {
      console.log("checklogin-cache");
      return true;
    }
  }

  /**
   * @function get_csrf
   * @parem void
   * @return {arrey}[csrf_token:string,Cookie]
   *
   * ログインに必要なCSRFトークンを取得
   * axiosInstanceにログイン用のCoockieをデフォルトとして設定
   */
  async get_csrf(session: boolean): Promise<any> {
    if (session === false) {
      // cookieなしでログインページにアクセス
      const response = await this.axiosInstance.get(url_login, {
        headers: { Cookie: "" },
      });
      //csrf_tokenをスクレイピング
      //jsdomの型定義ファイルを入れると競合？するのかエラーが出るのでrequireで読み込み
      const { JSDOM } = await require("jsdom");
      const { document } = new JSDOM(response.data).window;
      const input: any = document.getElementsByName("csrf_token")[0];
      // console.log(document);
      const returndata = input.value;
      //cookieを保存
      const Cookie = response.headers["set-cookie"];
      // console.log(response.headers);
      this.axiosInstance.defaults.headers.Cookie = Cookie;
      return [returndata, Cookie];
    } else {
      // cookieありでログインページにアクセス
      const response = await this.axiosInstance.get(url_login);
      //csrf_tokenをスクレイピング
      //jsdomの型定義ファイルを入れると競合？するのかエラーが出るのでrequireで読み込み
      const { JSDOM } = await require("jsdom");
      const { document } = new JSDOM(response.data).window;
      const input: any = document.getElementsByName("csrf_token")[0];
      // console.log(document);
      const returndata = input.value;
      //cookieを保存
      const Cookie = response.headers["set-cookie"];
      // console.log(response.headers);
      this.axiosInstance.defaults.headers.Cookie = Cookie;
      return [returndata, Cookie];
    }
  }

  /**
   * @param void
   * @return {string}
   * ログイン処理をする
   * ログイン済み(already)・ログイン成功(success)・ログイン失敗(Failure_Postdata:ユーザーネームまたはパスワードが違う,Failure_requestError:リクエストに関するエラー)を返す
   */
  async login(uesrname: string, password: string): Promise<any> {
    if ((await this.check_login()) === true) {
      return "already";
    } else {
      const csrf_token: any = await this.get_csrf(false);
      //配列をそのまま書くとoptionで送信してしまうためここで変換する
      const params = new URLSearchParams();
      params.append("csrf_token", csrf_token[0]);
      params.append("username", uesrname);
      params.append("password", password);
      const login_req: any = this.axiosInstance
        .post(url_login, params, {
          maxRedirects: 0,
          validateStatus: (status) =>
            (status >= 200 && status < 300) || status === 302,
        })
        .then((response: any) => {
          // console.log(result.headers["set-cookie"]);
          console.log("request_finish");
          const login_status = response.headers.location !== "/login";
          if (login_status) {
            const Cookie = response.headers["set-cookie"];
            // console.log(Cookie);
            this.axiosInstance.defaults.headers.Cookie = Cookie;
            // this.CheckSession = true;
            // console.log(Cookie);
            save_session.set("session", Cookie);
            save_session.set("ID", uesrname);
            save_session.set("checkLastest", Date.now());
            return "success";
          } else {
            // this.CheckSession = false;
            return "Failure_Postdata";
          }
          // console.log(Cookie);
        })
        .catch((err: any) => {
          console.log(err);
          return "Failure_requestError";
        });
      return await login_req;
    }
  }

  /**
   * ログアウトをする
   */
  async logout() {
    const csrf_token: any = await this.get_csrf(true);
    const url_logout = "https://atcoder.jp/logout";
    //配列をそのまま書くとoptionで送信してしまうためここで変換する
    const params = new URLSearchParams();
    params.append("csrf_token", csrf_token[0]);
    const login_req: any = this.axiosInstance
      .post(url_logout, params, {
        maxRedirects: 0,
        validateStatus: (status) =>
          (status >= 200 && status < 300) || status === 302,
      })
      .then((response: any) => {
        // console.log(result.headers["set-cookie"]);
        console.log(response.headers.location);
        const login_status = response.headers.location === "/home";
        if (login_status) {
          const Cookie = response.headers["set-cookie"];
          // console.log(Cookie);
          save_session.delete("session");
          save_session.delete("ID");
          this.axiosInstance.defaults.headers.Cookie = Cookie;
          console.log(this.axiosInstance.defaults.headers.Cookie);

          // this.CheckSession = true;
          // console.log(Cookie)
          return "success";
        } else {
          // this.CheckSession = false;
          return "Failure_Postdata";
        }
        // console.log(Cookie);
      })
      .catch((err: any) => {
        console.log(err);
        return "Failure_requestError";
      });
    return await login_req;
  }
  /**ログインされているユーザーIDを返す
   * @return {string|"nologin"}
   *
   * **/
  getUsername() {
    const login = this.check_login();
    if (login) {
      const username = save_session.get("ID");
      return username;
    } else {
      return undefined;
    }
  }
}
export const Atcoder = new AtcoderClass();
