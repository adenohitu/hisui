/// <reference types="node" />
import { EventEmitter } from "events";

export declare class hisuiEventtType extends EventEmitter {
  // 認証処理に関するイベント

  /**
   * ログインが成功した時に呼び出される
   */
  on(event: "login", listener: () => void): this;
  /**
   * ログアウトが実行された時に呼び出される
   */
  on(event: "logout", listener: () => void): this;

  // コンテストに関するイベント

  /**
   * デフォルトのコンテストが開始時刻になると一回呼び出される
   */
  on(event: "contest-start", listener: () => void): this;
  /**
   * デフォルトのコンテストが終了時刻になると一回呼び出される
   */
  on(event: "contest-end", listener: () => void): this;

  // MainWindowに関するイベント

  /**
   * MainWindowのViewの一番上のものが変更された時に実行される
   */
  on(event: "view-main-top", listener: (viewName: string) => void): this;
}
