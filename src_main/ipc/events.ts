// IPCのチャンネルを管理
export interface IpcEvent {
  mode: "handle" | "on" | "send";
}
/**
 * modeにはMainプロセスからみた時の状態を書く
 * @type { [key: string]: IpcEvent }
 */
export const IpcEvents = {
  // MainIPC
  OPEN_URL: { mode: "on" },
  SET_CONTESTID: { mode: "handle" },
  GET_SET_CONTESTID: { mode: "handle" },
  GET_CONTEST_LIST: { mode: "handle" },
  RUN_LOGIN: { mode: "handle" },
  RUN_LOGOUT: { mode: "handle" },
  GET_LOGIN_STATUS: { mode: "handle" },
  GET_USER_NAME: { mode: "handle" },
  GET_USER_DATA: { mode: "handle" },
  GET_CONTEST_DATE: { mode: "handle" },
  GET_STANDINGS: { mode: "handle" },
  GET_RANK: { mode: "handle" },
  GET_TOTAL: { mode: "handle" },
  GET_MY_SCORE: { mode: "handle" },
  GET_MY_SUBMISSIONS: { mode: "handle" },
  GET_TASK_LIST: { mode: "handle" },
  GET_MOSAIC_WINDOW_STATE: { mode: "handle" },
  SAVE_MOSAIC_WINDOW_STATE: { mode: "on" },
  CHANGE_VIEW_TOP: { mode: "on" },
  RUN_COPY_CLIPBOARD: { mode: "on" },
  RUN_GET_CLIPBOARD: { mode: "handle" },
  OPEN_LOGIN_DIALOG: { mode: "on" },
  OPEN_SELECT_CONTEST_DIALOG: { mode: "on" },

  UPDATE_DASHBOARD: { mode: "send" },
  LISTENER_OPEN_LOGIN_DIALOG: { mode: "send" },
  LISTENER_OPEN_DEFAULT_DIALOG: { mode: "send" },
};
export type IpcEventsKey = keyof typeof IpcEvents;
export const EventsArrey = Object.entries(IpcEvents);
