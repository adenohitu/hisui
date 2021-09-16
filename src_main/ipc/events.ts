// IPCのチャンネルを管理
export interface IpcEvent {
  channel: string;
  mode: "handle" | "send" | "on";
}
export const IpcEvents = {
  /**
   * modeにはMainプロセスからみた時の状態を書く
   */
  LOGIN_STATUS: { channel: "LOGIN_STATUS", mode: "handle" },
  CONTEST_LIST: { channel: "CONTEST_LIST", mode: "handle" },
  /**
   * レンダラーに情報を更新するようなイベントを発行するように指示する
   */
  UPDATE_DASHBOARD: { channel: "UPDATE_DASHBOARD", mode: "send" },
};

export type IpcEventsKey = keyof typeof IpcEvents;
export const rendererEvents = [
  IpcEvents.LOGIN_STATUS,
  IpcEvents.CONTEST_LIST,
  IpcEvents.UPDATE_DASHBOARD,
];
export const IpcMainEvents = [IpcEvents.LOGIN_STATUS, IpcEvents.CONTEST_LIST];
export const dashboardViewEvents = [IpcEvents.CONTEST_LIST];
