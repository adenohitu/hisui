// IPCのチャンネルを管理
export interface IpcEvent {
  mode: "handle" | "on" | "send";
}
/**
 * modeにはMainプロセスからみた時の状態を書く
 * @type { [key: string]: IpcEvent }
 */
export const IpcEvents = {
  OPEN_URL: { mode: "on" },
  SET_CONTESTID: { mode: "handle" },
  GET_SET_CONTESTID: { mode: "handle" },
  GET_CONTEST_LIST: { mode: "handle" },
  RUN_LOGIN: { mode: "handle" },
  RUN_LOGOUT: { mode: "handle" },
  GET_LOGIN_STATUS: { mode: "handle" },
  UPDATE_DASHBOARD: { mode: "send" },
  GET_USER_NAME: { mode: "handle" },
  GET_USER_DATA: { mode: "handle" },
  GET_CONTEST_DATE: { mode: "handle" },
};
export type IpcEventsKey = keyof typeof IpcEvents;
export const EventsArrey = Object.entries(IpcEvents);
