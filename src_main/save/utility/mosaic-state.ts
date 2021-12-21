//ウィンドウの状態に関するvalueを保存
import { ipcMainManager } from "../../ipc/ipc";
import { store } from "../save";

function makeSaveMosaicKey(mosaicWindowID: string) {
  return `WindowState_${mosaicWindowID}`;
}

export interface mosaicStateFormat {
  mosaicWindowID: string;
  elementViewIdList: string[];
  saveState: any;
}
/**
 * storeにMosaicの状態を保存
 */
export function saveMosaicState(arg: mosaicStateFormat): void {
  const saveKey = makeSaveMosaicKey(arg.mosaicWindowID);
  return store.set(saveKey, arg);
}
/**
 * storeからMosaicの状態を取得
 */
export function loadMosaicState(
  mosaicWindowID: string
): mosaicStateFormat | null {
  const saveKey = makeSaveMosaicKey(mosaicWindowID);
  const storeData: any = store.get(saveKey, null);
  return storeData;
}
/**
 * Mosaicの状態を初期化する信号を送信
 */
export function resetMosaicState(mosaicWindowID: string) {
  ipcMainManager.send("LISTENER_RESET_MOSAIC_WINDOW_STATE", mosaicWindowID);
}
