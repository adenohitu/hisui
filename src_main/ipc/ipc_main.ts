import { ipcMain } from "electron";
import { Atcoder } from "../data/atcoder";
import { urlOpen } from "../tool/openExternal";
import { getWindowState, saveWindowState } from "../save/utility/renderState";
import { contestDataApi } from "../data/contestdata";
import { getStandings, getRank, getTotal } from "../data/standing";
import { getTasklist } from "../data/task";
import { getUserData } from "../data/userdata";
import { getFiledata, runWritefile } from "../file/mkfile";
import { changeViewapi } from "../browserview/mgt/changeview";
import { copyClipboard, readClipboard } from "../tool/clipboard";
import { mainPageapi } from "../browserview/mainpageview";
import { submissionsApi } from "../data/submissions";
import { ipcMainManager } from "./ipc";
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
    const get = await getStandings(taskScreenName);
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
  ipcMainManager.handle("GET_MOSAIC_WINDOW_STATE", async (event) => {
    const get = await getWindowState();
    return get;
  });
  //windowの状態を保存
  ipcMainManager.on("SAVE_MOSAIC_WINDOW_STATE", (event, value) => {
    saveWindowState(value);
  });
  //問題情報を取得
  ipcMainManager.handle("GET_TASK_LIST", async (event) => {
    const get = await getTasklist();
    return get;
  });
  //ファイル操作
  //ファイル読み込みを行う
  ipcMain.handle("getFiledata", async (event, loadinfo) => {
    const get = await getFiledata(
      loadinfo.contestname,
      loadinfo.taskname,
      loadinfo.language
    );
    return get;
  });
  //ファイルに書き込みを行う
  ipcMain.handle("runWritefile", async (event, saveinfo) => {
    const get = await runWritefile(
      saveinfo.data,
      saveinfo.contestname,
      saveinfo.taskname,
      saveinfo.language
    );
    return get;
  });
  //表示するViewを変更
  ipcMain.on("change_view", (event, viewName) => {
    changeViewapi.change(viewName);
  });

  //クリップボードに書き込む
  ipcMain.on("copyClipboard", (event, clipData: string) => {
    copyClipboard(clipData);
  });

  //クリップボードを読み込む
  ipcMain.handle("readClipboard", (event) => {
    const get = readClipboard();
    return get;
  });
  //loginDialogを開く
  ipcMain.on("openLoginDialog", (event) => {
    mainPageapi.openLoginDialog();
  });
  //selectDafaultcontestを開く
  ipcMain.on("openselectDafaultcontest", (event) => {
    mainPageapi.openDafaultContestDialog();
  });
};
