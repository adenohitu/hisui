import { dashboadWindowState } from "./dafaltwindowState";
import { setState } from "./window";
// import { getnow } from "../menu/main";
//メインプロセスからファイルに保存してあるウィンドウ情報を取得
export async function getValue() {
  const value: any = await window.api.getWindowState_render();
  // 設定されていない（初回時）時はnullが返ってくる
  if (value == null) {
    return dashboadWindowState;
  } else {
    return value;
  }
}
// export function whiciwindow(value: any) {
//   // const now = getnow();
//   console.log(value);
//   if (value === "dashboad") {
//     setState(dashboadWindowState);
//   } else if (value === "editor") {
//     setState(editorWindowState);
//   }
// }
//状態を保存する
export async function setValue(value: any) {
  console.log("set");
  window.api.setWindowState_render(value);
}
export function setResetOn() {
  //ipcから受信 ウィンドウの配置を初期化する
  window.api.resetWindowState_render(() => {
    setState(dashboadWindowState);
    window.api.setWindowState_render(dashboadWindowState);
  });
}
