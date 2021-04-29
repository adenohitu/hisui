import axios from "axios";
const { dialog } = require("electron");
const statusUrl = "https://hisui-api.herokuapp.com/servicestatus";
export async function runServiceStatus() {
  const data: any = await axios.get(statusUrl);
  if (data.data.useapp === false) {
    const selectStatus = await dialog.showMessageBox({
      type: "warning",
      title: "アプリに不具合が見つかりました",
      message: "アプリに不具合が見つかりました",
      detail: "アプリに不具合が見つかりました ",
      buttons: ["アプリを終了する", "了解"],
      cancelId: -1, // Esc で閉じられたときの戻り値
    });
  }
}
