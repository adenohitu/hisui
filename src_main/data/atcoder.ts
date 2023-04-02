//atcoderとの通信用クラス
//ログインや通信を管理
//Copyright © 2020-2023 adenohitu. All rights reserved.
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { sessionRemove, setBrowserCoockie } from "../save/utility/session";
import { hisuiEvent } from "../event/event";
import { returnLogin, returnLogout } from "../interfaces";
import { saveSession } from "../save/save_session";
import { logger } from "../tool/logger/logger";

const url_login: string = "https://atcoder.jp/login";
/**
 * atcoderにアクセスする
 */
export class atcoderClass {
  userID: string | undefined;
  //AxiosInstanceを作成
  axiosInstance: AxiosInstance = axios.create({
    headers: { Cookie: saveSession.get("session", "") },
  });
  setup() {
    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const url = `${config.url}`;
        logger.info(
          `${logger.colors.blue}start${logger.colors.reset} request:Url=${url} Method=${config.method}`,
          "axios"
        );
        return config;
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const status = response.status;
        const url = response?.config.url;
        logger.info(
          `request ${logger.colors.green}success${logger.colors.reset}:Url=${url} Status=${status}`,
          "axios"
        );
        return response;
      },
      (error: AxiosError) => {
        logger.error(
          `request ${logger.colors.red}error${logger.colors.reset}:Url="${error.config.url}" message=${error.message}`,
          "axios"
        );
      }
    );
  }
  constructor() {
    // キャッシュにあるデータを取得
    this.userID = saveSession.get("ID");
    this.setup();
  }

  /**
   * セッションを使いログインされているかをチェック
   */
  checkLogin(): boolean {
    if (this.userID === undefined) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * ログインに必要なCSRFトークンを取得
   * 提出ページのURLを入力することで提出時に必要なTorkenを返す
   * falseでcookieなし trueCookieであり
   */
  async getCsrftoken(session: boolean, url: string = url_login) {
    if (session === false) {
      // cookieなしでログインページにアクセス
      const response = await this.axiosInstance.get(url, {
        headers: { Cookie: "" },
      });
      //csrf_tokenをスクレイピング
      //jsdomの型定義ファイルを入れると競合？するのかエラーが出るのでrequireで読み込み
      const { JSDOM } = await require("jsdom");
      const { document } = new JSDOM(response.data).window;
      const input = document.getElementsByName("csrf_token")[0];
      const returndata = input["value"];

      //cookieを保存
      //  axiosInstanceにログイン用のCoockieをデフォルトとして設定
      const Cookie = response.headers["set-cookie"];
      this.axiosInstance.defaults.headers.Cookie = Cookie;
      return [returndata, Cookie];
    } else {
      // ログインページ以外のCsrfTorken取得
      const response = await this.axiosInstance.get(url);

      //csrf_tokenをスクレイピング
      //jsdomの型定義ファイルを入れると競合？するのかエラーが出るのでrequireで読み込み
      const { JSDOM } = await require("jsdom");
      const { document } = new JSDOM(response.data).window;
      const input: any = document.getElementsByName("csrf_token")[0];

      const returndata = input["value"];
      return [returndata, undefined];
    }
  }

  /**
   * ログイン処理をする
   * ログイン済み(already)・ログイン成功(success)・ログイン失敗(Failure_Postdata:ユーザーネームまたはパスワードが違う,Failure_requestError:リクエストに関するエラー)を返す
   */
  async runLogin(uesrname: string, password: string): Promise<returnLogin> {
    if ((await this.checkLogin()) === true) {
      return "already";
    } else {
      const csrf_token: any = await this.getCsrftoken(false);
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
          const login_status = response.headers.location !== "/login";
          if (login_status) {
            const Cookie = response.headers["set-cookie"];
            this.axiosInstance.defaults.headers.Cookie = Cookie;
            saveSession.set("session", Cookie);
            saveSession.set("ID", uesrname);
            saveSession.set("checkLastest", Date.now());
            this.userID = uesrname;
            // ウィンドウのセッションを同期
            setBrowserCoockie();
            logger.info("loginSuccess", "AtcoderAPI");
            // ログインイベントを発行
            hisuiEvent.emit("login");
            return "success";
          } else {
            return "Failure_Postdata";
          }
        })
        .catch((err: any) => {
          logger.info(`Failure_requestError:${err}`, "AtcoderAPI");
          return "Failure_requestError";
        });
      return await login_req;
    }
  }

  /**
   * ログアウトをする
   * Store・ブラウザ・AxiosInstanceに保存されているセッション情報、を削除する
   */
  async runLogout(): Promise<returnLogout> {
    const csrf_token: any = await this.getCsrftoken(true);
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
        const login_status = response.headers.location === "/home";
        if (login_status) {
          const Cookie = response.headers["set-cookie"];
          saveSession.delete("session");
          saveSession.delete("ID");
          this.userID = undefined;
          this.axiosInstance.defaults.headers.Cookie = Cookie;
          // browserwindowのセッションを削除
          sessionRemove();
          hisuiEvent.emit("logout");
          return "success";
        } else {
          return "Failure_Postdata";
        }
      })
      .catch((err: any) => {
        logger.info(`Failure_requestError:${err}`, "AtcoderAPI");
        return "Failure_requestError";
      });
    return await login_req;
  }
  /**
   * ログインされているユーザーIDを返す
   */
  getUsername() {
    const username = saveSession.get("ID", undefined);
    return username;
  }
}

/**
 * Atcoderclassを初期化
 */
export const Atcoder = new atcoderClass();
