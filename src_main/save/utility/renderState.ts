//ウィンドウの状態に関するvalueを保存
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
