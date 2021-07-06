// ブラウザで開く
import { shell } from "electron";
const urlOpen = async (url: string) => {
  await shell.openExternal(url);
};
export default urlOpen;
