import { ipcMain } from "electron";
import { Atcoder } from "./data/atcoder";
import urlOpen from "./tool/openExternal";
import { getWindowState, setWindowState } from "./save/renderState";
import {
  set_SetContestID,
  getContestID,
  getContestInfo,
  get_date,
  get_Score,
  get_submissions_me,
} from "./data/contestData";
import { get_Standings, getRank, getTotal } from "./data/standing";
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
  ipcMain.handle("set_SetContestID", async (event, contest_short_name) => {
    const get: any = await set_SetContestID(contest_short_name);
    return get;
  });
  //デフォルトで設定されたコンテストIDを返す
  ipcMain.handle("get_SetContestID", async (event, message) => {
    const get: any = await getContestID();
    return get;
  });
  //開催中・開催予定のコンテストをhashで出力
  ipcMain.handle("get_contest_list_main", async (event, message) => {
    const get: any = await getContestInfo();
    return get;
  });
  //ログイン状態を確認
  ipcMain.handle("get_login_status", async (event, message) => {
    const get = await Atcoder.check_login();
    return get;
  });
  //ログイン状態処理を実行
  ipcMain.handle("login", async (event, userdata) => {
    // console.log(Atcoder_class.axiosInstance);
    const get = await Atcoder.login(userdata.username, userdata.password);
    return get;
  });
  //ログアウト
  ipcMain.handle("logout", async (event, message) => {
    const get = await Atcoder.logout();
    return get;
  });
  //ログインされているユーザーIDを返す
  ipcMain.handle("getUsername", async (event, message) => {
    const get = await Atcoder.getUsername();
    return get;
  });
  //開始時間と終了時間を取得
  ipcMain.handle("get_date", async (event, contest_short_name) => {
    // console.log(Atcoder_class.axiosInstance);
    const get = await get_date(contest_short_name);
    return get;
  });
  //順位情報リストを取得
  ipcMain.handle("get_Standings", async (event, contest_short_name) => {
    // console.log(Atcoder_class.axiosInstance);
    const get = await get_Standings(contest_short_name);
    return get;
  });
  //自分の順位を取得ipc.invoke
  ipcMain.handle("getRank", async (event, contest_short_name) => {
    // console.log(Atcoder_class.axiosInstance);
    const get = await getRank(contest_short_name);
    return get;
  });

  //自分の順位を取得ipc,on,send
  ipcMain.on("getRanksend", async (event, contest_short_name) => {
    const get = await getRank(contest_short_name);

    event.sender.send("getRank_replay", get);
  });

  //順位表の集計結果を取得
  ipcMain.handle("getTotal", async (event, contest_short_name) => {
    // console.log(Atcoder_class.axiosInstance);
    const get = await getTotal(contest_short_name);
    return get;
  });
  //順位表の集計結果を取得ipc,on,send
  ipcMain.on("getTotalsend", async (event, contest_short_name) => {
    const get = await getTotal(contest_short_name);
    //送り返す
    event.sender.send("getTotal_replay", get);
  });

  //得点情報を取得
  ipcMain.handle("get_Score", async (event, contest_short_name) => {
    // console.log(Atcoder_class.axiosInstance);
    const get = await get_Score(contest_short_name);
    return get;
  });
  //自分の提出を取得
  ipcMain.handle("get_submissions_me", async (event, contest_short_name) => {
    // console.log(Atcoder_class.axiosInstance);
    const get = await get_submissions_me(contest_short_name);
    return get;
  });
  //自分の提出を取得ipc,on,send
  ipcMain.on("getSubmissionsMeSend", async (event, contest_short_name) => {
    const get = await get_submissions_me(contest_short_name);
    event.sender.send("getSubmissionsMe_replay", get);
  });

  //windowの状態を取得
  ipcMain.handle("getWindowState", async (event, contest_short_name) => {
    const get = await getWindowState();
    return get;
  });
  //windowの状態を設定
  ipcMain.on("setWindowState", (event, value) => {
    setWindowState(value);
    // console.log(value);
  });
};
