// イベントを管理
import EventEmitter from "events";
import { hisuiEventtType } from "../@types/hisui";
/**
 * Hisuiのイベント
 * EventEmitterを継承
 */
export const hisuiEvent: hisuiEventtType = new EventEmitter();
/**
 * event一覧
 * コンテスト中に関するイベント
 * contest-start
 * デフォルトのコンテストが開始時刻になると一回呼び出される
 * contest-end
 * デフォルトのコンテストが終了時刻になると一回呼び出される
 *
 * 認証処理に関するイベント
 * login
 * ログインが成功した時に呼び出される
 * logout
 * ログアウトが実行された時に呼び出される
 *
 * Viewに関するイベント
 * hisuiEvent.emit('view-main-top', viewName);
 * MainWindowで一番上のViewが変更された時に呼び出される
 *
 *
 */
