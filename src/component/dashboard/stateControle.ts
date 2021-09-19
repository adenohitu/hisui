import { MosaicNode } from "react-mosaic-component";
import { ipcRendererManager } from "../../ipc";
import { dashboadWindowState } from "./dafaltwindowState";
import { setState } from "./window";
// import { getnow } from "../menu/main";
//メインプロセスからファイルに保存してあるウィンドウ情報を取得
export async function getValue() {
  const value: any = await ipcRendererManager.invoke("GET_MOSAIC_WINDOW_STATE");
  // 設定されていない（初回時）時はnullが返ってくる
  if (value == null) {
    return dashboadWindowState;
  } else {
    return value;
  }
}
//状態を保存する
export async function setValue(value: MosaicNode<string> | null) {
  console.log("set");
  ipcRendererManager.invoke("SAVE_MOSAIC_WINDOW_STATE", value);
}
function reset() {
  setState(dashboadWindowState);
  setValue(dashboadWindowState);
}
export function setResetOn() {
  //ipcから受信 ウィンドウの配置を初期化する
  ipcRendererManager.on("LISTENER_RESET_MOSAIC_WINDOW_STATE", reset, true);
}
