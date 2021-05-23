// イベントを管理
import EventEmitter from "events";
/**
 * 設定されているコンテストが開始したタイミングでイベントが発行される
 */
export const startEvent = new EventEmitter();
/**
 * 設定されているコンテストが終了したタイミングでイベントが発行される
 */
export const endEvent = new EventEmitter();
