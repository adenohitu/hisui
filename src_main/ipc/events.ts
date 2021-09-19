// IPCのチャンネルを管理
export interface IpcEvent {
  channel: string;
  mode: "handle" | "send" | "on";
}
/**
 * modeにはMainプロセスからみた時の状態を書く
 */
export const IpcEvents = {
  LOGIN_STATUS: { channel: "LOGIN_STATUS", mode: "handle" },
  URL_OPEN: { channel: "URL_OPEN", mode: "on" },
  UPDATE_DASHBOARD: { channel: "UPDATE_DASHBOARD", mode: "send" },
};
export type IpcEventsKey = keyof typeof IpcEvents;
export const rendererEvents = [
  IpcEvents.LOGIN_STATUS,
  IpcEvents.URL_OPEN,
  IpcEvents.UPDATE_DASHBOARD,
];
