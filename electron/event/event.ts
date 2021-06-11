// イベントを管理
import EventEmitter from "events";
/**
 * 設定されているコンテストが開始したタイミングでイベントが発行される
 */
export const hisuiEvent = new EventEmitter();
/**
 * event一覧
 *
 * contest-start
 * デフォルトのコンテストが開始時刻になると一回呼び出される
 * contest-end
 * デフォルトのコンテストが終了時刻になると一回呼び出される
 * login
 * ログインが成功した時に呼び出される
 * logout
 * ログアウトが実行された時に呼び出される
 *
 *
 */
