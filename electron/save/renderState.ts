//ウィンドウの状態に関するvalueを保存
import { store } from "./save";
export const getWindowState = () => {
  return store.get("WindowState", null);
};
export const setWindowState = (value: any) => {
  store.set("WindowState", value);
};
