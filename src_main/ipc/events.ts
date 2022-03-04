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
  RUN_UPDATE_SUBMISSIONS: { mode: "on" },
  GET_NOWTOP_TASK_SAMPLECASE: { mode: "handle" },
  RUN_RELOAD_SNIPPET: { mode: "on" },
  GET_LANG_SNIPPET: { mode: "handle" },
  SET_LANG_SNIPPET: { mode: "handle" },
  RUN_SET_WINDOW_SPLIT: { mode: "on" },
  OPEN_CONTEXT_MENU: { mode: "on" },
  // ContestDataIPC
  GET_SUBMIT_LANGUAGE_LIST: { mode: "handle" },
  // EditorIPC
  EDITOR_MODEL_CONTENTS_CHANGE: { mode: "on" },
  LISTENER_EDITOR_STATUS: { mode: "send" },
  GET_TASK_CONT_STATUS_ALL: { mode: "handle" },
  LISTENER_CHANGE_TASK_CONT_STATUS: { mode: "send" },
  CLOSE_TASKCONT: { mode: "on" },
  LISTENER_EDITOR_MODEL_REMOVE: { mode: "send" },
  SET_SUBMIT_LANGUAGE: { mode: "on" },
  GET_NOWTOP_EDITOR_LANGUAGE: { mode: "handle" },
  // MonacoIPC
  CREATE_EDITOR_MODEL: { mode: "send" },
  SET_EDITOR_MODEL: { mode: "send" },
  CHANGE_EDITOR_VALUE: { mode: "send" },
  CHANGE_EDITOR_LANGUAGE: { mode: "send" },
  // GET_VALUE: { mode: "send" },
  // TaskContIPC
  CREATE_TASKCONT: { mode: "on" },
  RUN_SAVE_TASKCONT: { mode: "on" },
  SET_DEFAULT_LANGUAGE: { mode: "on" },
  RUN_SUBMIT_NOWTOP: { mode: "on" },
  RUN_CODETEST_NOWTOP: { mode: "on" },
  // CodeTestIPC
  LISTENER_UPDATE_DASHBOARD: { mode: "send" },
  // ListenerIPC
  LISTENER_CODETEST_STATUS_EVENT: { mode: "send" },
  LISTENER_OPEN_LOGIN_DIALOG: { mode: "send" },
  LISTENER_OPEN_DEFAULT_DIALOG: { mode: "send" },
  LISTENER_OPEN_EDITOR_SETTING_DIALOG: { mode: "send" },
  LISTENER_RESET_MOSAIC_WINDOW_STATE: { mode: "send" },
  LISTENER_CHANGE_SET_CONTESTID: { mode: "send" },
  LISTENER_RETUEN_SUBMISSIONS: { mode: "send" },
  LISTENER_VIEW_TOP: { mode: "send" },
  LISTENER_CHANGE_EDITOR_SNIPPET: { mode: "send" },
  // timerIPC
  LISTENER_TIMER_TICK: { mode: "send" },
  LISTENER_CONTEST_START: { mode: "send" },
  // taskViewcontIPC
  LISTENER_CHANGE_TASKPAGE_VIEW: { mode: "on" },
  LISTENER_CHANGE_LIBMANAGEMENT_VIEW: { mode: "on" },
  RUN_NOWTASKVIEW_RESET: { mode: "on" },
  RUN_NOWTASKVIEW_RELOAD: { mode: "on" },
  RUN_CHANGE_TASKVIEW: { mode: "on" },
  // StoreIPC
  GET_STORE: { mode: "handle" },
  SET_STORE: { mode: "handle" },
  // PluginIPC
  // LISTENER_ADD_VIEWOPEN_BUTTON: { mode: "send" },
};
export type IpcEventsKey = keyof typeof IpcEvents;
export const EventsArrey = Object.entries(IpcEvents);
