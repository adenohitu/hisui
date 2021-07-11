import { dashboardapi } from "../dashboardview";
import { editorViewapi } from "../editorview";
import { mainPageapi } from "../mainpageview";
/**
 * 全てのViewにIPCEventを送る
 */
export function ipcSendall(channel: string, ...args: any[]) {
  mainPageapi.mainPageView?.webContents.send(channel, ...args);
  editorViewapi.editorView?.webContents.send(channel, ...args);
  dashboardapi.dashboardView?.webContents.send(channel, ...args);
}
