import { ipcMain } from "electron";
import { Atcoder } from "./data/atcoder";
import urlOpen from "./tool/openExternal";
import { getWindowState, setWindowState } from "./browser/renderState";
import { contestDataApi } from "./data/contestdata";
import { getStandings, getRank, getTotal } from "./data/standing";
import { getTasklist } from "./data/task";
import { getUserData } from "./data/userdata";
import { getFiledata, runWritefile } from "./file/mkfile";
import { changeViewapi } from "./browserview/mgt/changeview";
import { copyClipboard, readClipboard } from "./tool/clipboard";
import { mainPageapi } from "./browserview/mainpageview";
import { submissionsApi } from "./data/submissions";
//ipc通信
export const main_ipc = () => {
  //ipcテスト用
  ipcMain.on("msg_render_to_main", (event, arg) => {
    console.log(arg);
  });
  //ipc送受信テスト
  ipcMain.on("ipctest", (event, arg) => {
    console.log(arg);
    event.sender.send("ipctest_replay", "replay");
  });
  //ブラウザでurlを開く
  ipcMain.on("urlOpen", (event, arg) => {
    urlOpen(arg);
  });
  //デフォルトのコンテストIDを設定する
  ipcMain.handle("set_SetContestID", async (event, ContestID) => {
    const get: any = await contestDataApi.setDefaultContestID(ContestID);
    return get;
  });
  //デフォルトで設定されたコンテストIDを返す
  ipcMain.handle("get_SetContestID", async (event, message) => {
    const get = contestDataApi.getDefaultContestID();
    return get;
  });
  //開催中・開催予定のコンテストをhashで出力
  ipcMain.handle("get_contest_list_main", async (event, message) => {
    const get: any = await contestDataApi.getContestInfo();
    return get;
  });
  //ログイン状態を確認
  ipcMain.handle("get_login_status", async (event, message) => {
    const get = await Atcoder.checkLogin();
    return get;
  });
  //ログイン状態処理を実行
  ipcMain.handle("login", async (event, userdata) => {
    // console.log(Atcoder_class.axiosInstance);
    const get = await Atcoder.runLogin(userdata.username, userdata.password);
    return get;
  });
  //ログアウト
  ipcMain.handle("logout", async (event, message) => {
    const get = await Atcoder.runLogout();
    return get;
  });
  //ログインされているユーザーIDを返す
  ipcMain.handle("getUsername", async (event, message) => {
    const get = await Atcoder.getUsername();
    return get;
  });
  //ユーザー情報を返す
  ipcMain.handle("getUserData", async (event, user) => {
    // console.log(Atcoder_class.axiosInstance);
    const get = await getUserData(user);
    return get;
  });
  //開始時間と終了時間を取得
  ipcMain.handle("get_date", async (event, contestID) => {
    // console.log(Atcoder_class.axiosInstance);
    const get = await contestDataApi.getContestDate(contestID);
    return get;
  });
  //順位情報リストを取得
  ipcMain.handle("get_Standings", async (event, taskScreenName) => {
    // console.log(Atcoder_class.axiosInstance);
    const get = await getStandings(taskScreenName);
    return get;
  });
  //自分の順位を取得ipc.invoke
  ipcMain.handle("getRank", async (event, taskScreenName) => {
    // console.log(Atcoder_class.axiosInstance);
    const get = await getRank(taskScreenName);
    return get;
  });

  //自分の順位を取得ipc,on,send
  ipcMain.on("getRanksend", async (event, taskScreenName) => {
    const get = await getRank(taskScreenName);

    event.sender.send("getRank_replay", get);
  });

  //順位表の集計結果を取得
  ipcMain.handle("getTotal", async (event, taskScreenName) => {
    // console.log(Atcoder_class.axiosInstance);
    const get = await getTotal(taskScreenName);
    return get;
  });
  //順位表の集計結果を取得ipc,on,send
  ipcMain.on("getTotalsend", async (event, taskScreenName) => {
    const get = await getTotal(taskScreenName);
    //送り返す
    event.sender.send("getTotal_replay", get);
  });

  //得点情報を取得
  ipcMain.handle("get_Score", async (event, contestID) => {
    // console.log(Atcoder_class.axiosInstance);
    const get = await submissionsApi.getContestScore(contestID);
    return get;
  });
  //自分の提出を取得
  ipcMain.handle("get_submissions_me", async (event, contestID) => {
    // console.log(Atcoder_class.axiosInstance);
    const get = await submissionsApi.getSubmissionMe(contestID);
    return get;
  });
  //自分の提出を取得ipc,on,send
  ipcMain.on("getSubmissionsMeSend", async (event, contestID) => {
    const get = await submissionsApi.getSubmissionMe(contestID);
    event.sender.send("getSubmissionsMe_replay", get);
  });

  //windowの状態を取得
  ipcMain.handle("getWindowState", async (event, contestID) => {
    const get = await getWindowState();
    return get;
  });
  //windowの状態を設定
  ipcMain.on("setWindowState", (event, value) => {
    setWindowState(value);
  });
  //問題情報を取得
  ipcMain.on("getTasklist", async (event, taskScreenName) => {
    const get = await getTasklist();

    event.sender.send("getTasklist_replay", get);
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
