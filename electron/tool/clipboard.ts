import { clipboard } from "electron";
/**
 * クリップボードにテキストを書き込む
 */
export function copyClipboard(clipData: string) {
  clipboard.writeText(clipData);
  console.log("クリップボードに書き込みました");
}

/**
 * クリップボードを読み込む
 */
export function readClipboard() {
  console.log("クリップボードを読み込みました");
  return clipboard.readText();
}
