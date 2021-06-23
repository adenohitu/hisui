// HisuiEventのType
// Copyright © 2021 adenohitu. All rights reserved.
/// <reference types="node" />
import { EventEmitter } from "events";

export declare class hisuiEventtType extends EventEmitter {
  // --認証処理に関するイベント--

  emit(event: "login"): boolean;
  /**
   * ログインが成功した時に呼び出される
   */
  on(event: "login", listener: () => void): this;

  emit(event: "logout"): boolean;
  /**
   * ログアウトが実行された時に呼び出される
   */
  on(event: "logout", listener: () => void): this;

  // --コンテストに関するイベント--

  emit(event: "contest-start"): boolean;
  /**
   * デフォルトのコンテストが開始時刻になると一回呼び出される
   */
  on(event: "contest-start", listener: () => void): this;

  emit(event: "contest-end"): boolean;
  /**
   * デフォルトのコンテストが終了時刻になると一回呼び出される
   */
  on(event: "contest-end", listener: () => void): this;

  emit(event: "DefaultContestID-change", args: string): boolean;
  /**
   * デフォルトのコンテストが変更されると実行
   * 変更後のコンテストIDを返す
   */
  on(event: "DefaultContestID-change", listener: (args: string) => void): this;

  // --MainWindowに関するイベント--

  emit(event: "view-main-top", args: string): boolean;
  /**
   * MainWindowのViewの一番上のものが変更された時に実行される
   */
  on(event: "view-main-top", listener: (viewName: string) => void): this;
}
