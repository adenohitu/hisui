// ブラウザで開く
import { dialog, shell } from "electron";

/**
 * openExternalのURLチェック
 */
export const isSafeForExternalOpen = (url: string) => {
  // 信頼できるURLのList
  const ListSuccessURL = ["https://atcoder.jp", "https://img.atcoder.jp"];
  const parsedUrl = new URL(url);
  if (ListSuccessURL.includes(parsedUrl.origin)) {
    return true;
  } else {
    return false;
  }
};

/**
 * openExternalでURLを開く
 */
export const urlOpen = async (url: string) => {
  if (isSafeForExternalOpen(url)) {
    setImmediate(() => {
      shell.openExternal(url);
    });
  } else {
    // サイトを開くときの注意
    const selectStatus = await dialog.showMessageBox({
      type: "info",
      title: "warning",
      message: `${url}を開きます`,
      buttons: ["OK", "キャンセル"],
    });
    if (selectStatus.response === 0) {
      setImmediate(() => {
        shell.openExternal(url);
      });
    }
  }
};
