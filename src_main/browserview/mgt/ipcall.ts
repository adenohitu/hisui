import { dashboardapi } from "../dashboardview";
import { editorViewapi } from "../editorview";
import { mainPageapi } from "../mainpageview";
/**
 * 全てのViewにIPCEventを送る
 */
export function ipcSendall(channel: string, ...args: any[]) {
  mainPageapi.view?.webContents.send(channel, ...args);
  editorViewapi.view?.webContents.send(channel, ...args);
  dashboardapi.view?.webContents.send(channel, ...args);
}
