// イベントを管理
import EventEmitter from "events";
import { hisuiEventtType } from "../@types/hisui";
/**
 * Hisuiのイベント
 * EventEmitterを継承
 * eventは　hisui.d.tsに記入
 */
export const hisuiEvent: hisuiEventtType = new EventEmitter();
