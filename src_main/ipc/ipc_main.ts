import { Atcoder } from "../data/atcoder";
import { urlOpen } from "../tool/openExternal";
import {
  loadMosaicState,
  mosaicStateFormat,
  saveMosaicState,
} from "../save/utility/mosaic-state";
import { contestDataApi } from "../data/contestdata";
import { getRank, getTotal, standingsApi } from "../data/standing";
import { TaskListApi } from "../data/task";
import { getUserData } from "../data/userdata";
import { changeViewapi } from "../browserview/mgt/changeview";
import { copyClipboard, readClipboard } from "../tool/clipboard";
import { submissionsApi } from "../data/submissions";
import { ipcMainManager } from "./ipc";
import { setWindowSplit } from "../browser/tool/monitorsize";
import { taskViewWindowApi } from "../browser/taskviewwindow";
//ipc通信
export const load_ipc = () => {
  //ブラウザでurlを開く
  ipcMainManager.on("OPEN_URL", (event, arg) => {
    urlOpen(arg);
  });
  //デフォルトのコンテストIDを設定する
  ipcMainManager.handle("SET_CONTESTID", async (event, ContestID) => {
    const get: boolean = await contestDataApi.setDefaultContestID(ContestID);
    return get;
  });
  //デフォルトで設定されたコンテストIDを返す
  ipcMainManager.handle("GET_SET_CONTESTID", async (event, message) => {
    const get = contestDataApi.getDefaultContestID();
    return get;
  });
  //開催中・開催予定のコンテストをhashで出力
  ipcMainManager.handle("GET_CONTEST_LIST", async (event, message) => {
    const get = await contestDataApi.getContestInfo();
    return get;
  });
  //ログイン処理を実行
  ipcMainManager.handle("RUN_LOGIN", async (event, userdata) => {
    const get = await Atcoder.runLogin(userdata.username, userdata.password);
    return get;
  });
  //ログアウト
  ipcMainManager.handle("RUN_LOGOUT", async (event, message) => {
    const get = await Atcoder.runLogout();
    return get;
  });
  // ログイン状態
  ipcMainManager.handle("GET_LOGIN_STATUS", async (event, message) => {
    const get = await Atcoder.checkLogin();
    return get;
  });
  //ログインされているユーザーIDを返す
  ipcMainManager.handle("GET_USER_NAME", async (event, message) => {
    const get = await Atcoder.getUsername();
    return get;
  });
  //ユーザー情報を返す
  ipcMainManager.handle("GET_USER_DATA", async (event, user) => {
    const get = await getUserData(user);
    return get;
  });
  //開始時間と終了時間を取得
  ipcMainManager.handle("GET_CONTEST_DATE", async (event, contestID) => {
    const get = await contestDataApi.getContestDate(contestID);
    return get;
  });
  //順位情報リストを取得
  ipcMainManager.handle("GET_STANDINGS", async (event, taskScreenName) => {
    const get = await standingsApi.getStandings(taskScreenName);
    return get;
  });
  //自分の順位を取得ipc.invoke
  ipcMainManager.handle("GET_RANK", async (event, taskScreenName) => {
    const get = await getRank(taskScreenName);
    return get;
  });
  //順位表の集計結果を取得
  ipcMainManager.handle("GET_TOTAL", async (event, taskScreenName) => {
    const get = await getTotal(taskScreenName);
    return get;
  });
  //得点情報を取得
  ipcMainManager.handle("GET_MY_SCORE", async (event, contestID) => {
    const get = await submissionsApi.getContestScore(contestID);
    return get;
  });
  //自分の提出を取得
  ipcMainManager.handle("GET_MY_SUBMISSIONS", async (event, contestID) => {
    const get = await submissionsApi.getSubmissionMe(contestID);
    return get;
  });
  //windowの状態を取得
  ipcMainManager.handle("GET_MOSAIC_WINDOW_STATE", async (event, id) => {
    const get = await loadMosaicState(id);
    return get;
  });
  //windowの状態を保存
  ipcMainManager.on(
    "SAVE_MOSAIC_WINDOW_STATE",
    (event, value: mosaicStateFormat) => {
      saveMosaicState(value);
    }
  );
  //問題情報を取得
  ipcMainManager.handle("GET_TASK_LIST", async (event, cache) => {
    const get = await TaskListApi.getTaskList(cache);
    return get;
  });
  //表示するViewを変更
  ipcMainManager.on("CHANGE_VIEW_TOP", (event, viewName) => {
    changeViewapi.change(viewName);
  });

  //クリップボードに書き込む
  ipcMainManager.on("RUN_COPY_CLIPBOARD", (event, clipData: string) => {
    copyClipboard(clipData);
  });

  //クリップボードを読み込む
  ipcMainManager.handle("RUN_GET_CLIPBOARD", (event) => {
    const get = readClipboard();
    return get;
  });
  //loginDialogを開く
  ipcMainManager.on("OPEN_LOGIN_DIALOG", (event) => {
    ipcMainManager.send("LISTENER_OPEN_LOGIN_DIALOG");
  });
  //selectDafaultcontestを開く
  ipcMainManager.on("OPEN_SELECT_CONTEST_DIALOG", (event) => {
    ipcMainManager.send("LISTENER_OPEN_DEFAULT_DIALOG");
  });
  //
  // setWindowSplitを実行
  ipcMainManager.on("RUN_SET_WINDOW_SPLIT", (event) => {
    // Workエリアを左右に分割しWindowをセット
    setWindowSplit();
  });
  ipcMainManager.on("LISTENER_CHANGE_TASKPAGE_VIEW", () => {
    taskViewWindowApi.openTasksPage();
  });
  ipcMainManager.on("LISTENER_CHANGE_LIBMANAGEMENT_VIEW", () => {
    taskViewWindowApi.changeViewTop("lib-management");
  });
  ipcMainManager.handle("GET_OS", async () => {
    return process.platform;
  });
};
