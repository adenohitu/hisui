import { type } from "os"; // eslint-disable-line
import { createTaskContType } from "./editor/control";
import { syncEditorType, createEditorModelType } from "./editor/taskcont";
import { languagetype } from "./file/extension";

const { contextBridge, ipcRenderer } = require("electron");
//分離されたプリロードスクリプト
type Data = string;
contextBridge.exposeInMainWorld("api", {
  send: (data: Data) => {
    ipcRenderer.send("msg_render_to_main", data);
  },
  //ipctest
  ipdtest_send_render: () => {
    ipcRenderer.send("ipctest", "ping");
  },
  ipdtest_on_render: () => {
    ipcRenderer.on("ipctest_replay", (event, arg) => {
      console.log(arg);
    });
  },
  urlOpen_render: (data: string) => {
    ipcRenderer.send("urlOpen", data);
  },
  //ブラウザでurlを開く
  loginOpen: (func: any) => {
    ipcRenderer.removeAllListeners("loginOpen");
    //rendererでの受信用, funcはコールバック関数//
    ipcRenderer.on("loginOpen", func);
  },
  //コンテスト設定画面を表示
  dafaltContestOpen: (func: any) => {
    ipcRenderer.removeAllListeners("dafaltContest");
    ipcRenderer.on("dafaltContest", func);
  },

  //デフォルトのコンテストIDを設定する
  set_SetContestID_render: async (taskScreenName: any) => {
    const data: any = await ipcRenderer.invoke(
      "set_SetContestID",
      taskScreenName
    );
    return data;
  },
  //デフォルトで設定されたコンテストIDを返す
  get_SetContestID_render: async () => {
    const data: any = await ipcRenderer.invoke("get_SetContestID");
    return data;
  },
  //開催中・開催予定のコンテストをhashで出力
  get_contest_list_render: async () => {
    const data: any = await ipcRenderer.invoke("get_contest_list_main");
    return data;
  },
  //ログイン状態を確認
  get_login_status_render: async () => {
    const data: any = await ipcRenderer.invoke("get_login_status");
    return data;
  },
  //ログイン処理を実行
  login_render: async (userdata: any) => {
    const data: any = await ipcRenderer.invoke("login", userdata);
    return data;
  },
  logout_render: async () => {
    const data: any = await ipcRenderer.invoke("logout");
    return data;
  },
  //ログインされているユーザーIDを返す
  getUsername_render: async () => {
    const data: any = await ipcRenderer.invoke("getUsername");
    return data;
  },
  //ユーザー情報を返す
  getUserData_render: async (user: any) => {
    const data: any = await ipcRenderer.invoke("getUserData", user);
    return data;
  },
  //開始時間と終了時間を取得
  get_date_render: async (taskScreenName: any) => {
    const data: any = await ipcRenderer.invoke("get_date", taskScreenName);
    return data;
  },
  //順位情報リストを取得
  get_Standings_render: async (taskScreenName: any) => {
    const data: any = await ipcRenderer.invoke("get_Standings", taskScreenName);
    return data;
  },
  //自分の順位を取得
  getRank_render: async (taskScreenName: any) => {
    const data: any = await ipcRenderer.invoke("getRank", taskScreenName);
    return data;
  },

  //ipcrank send on
  getRank_send_render: (taskScreenName: any) => {
    ipcRenderer.send("getRanksend", taskScreenName);
  },
  getRank_on_render: (func: any) => {
    ipcRenderer.once("getRank_replay", (event, arg) => {
      // console.log(func);
      func(arg);
    });
  },

  //updateDashboard
  updateDashboard: async (func: any) => {
    ipcRenderer.on("updateDashboard_replay", (event, arg) => {
      func(arg);
    });
  },
  //順位表の集計情報を取得
  getTotal_render: async (taskScreenName: any) => {
    const data: any = await ipcRenderer.invoke("getTotal", taskScreenName);
    return data;
  },
  //ipcrank send on
  getTotalsend_render: (taskScreenName: any) => {
    ipcRenderer.send("getTotalsend", taskScreenName);
  },
  getTotal_on_render: (func: any) => {
    ipcRenderer.once("getTotal_replay", (event, arg) => {
      func(arg);
    });
  },

  //得点情報を取得
  get_Score_render: async (taskScreenName: any) => {
    const data: any = await ipcRenderer.invoke("get_Score", taskScreenName);
    return data;
  },
  //自分の提出を取得
  get_submissions_me_render: async (taskScreenName: any) => {
    const data: any = await ipcRenderer.invoke(
      "get_submissions_me",
      taskScreenName
    );
    return data;
  },

  //ipcsubmission send on
  getSubmissions_send_render: (taskScreenName: any) => {
    ipcRenderer.send("getSubmissionsMeSend", taskScreenName);
  },
  getSubmissions_on_render: (func: any) => {
    ipcRenderer.once("getSubmissionsMe_replay", (event, arg) => {
      func(arg);
    });
  },

  //windowの状態を取得
  getWindowState_render: async () => {
    const data: any = await ipcRenderer.invoke("getWindowState");
    return data;
  },
  //windowの状態を設定
  setWindowState_render: (value: any) => {
    ipcRenderer.send("setWindowState", value);
  },
  //windowの配置をリセット
  resetWindowState_render: async (func: any) => {
    //初期化
    ipcRenderer.removeAllListeners("resetWindowState_render");
    //rendererでの受信用, funcはコールバック関数
    ipcRenderer.on("resetWindowState", func);
  },

  //問題情報を取得 send on
  getTasklist_send_render: (taskScreenName: any) => {
    ipcRenderer.send("getTasklist", taskScreenName);
  },
  getTasklist_on_render: (func: any) => {
    ipcRenderer.once("getTasklist_replay", (event, arg) => {
      func(arg);
    });
  },

  //ファイル操作
  //ファイル読み込みを行う

  getFiledata_render: async (arg: any) => {
    const data: any = await ipcRenderer.invoke("getFiledata", arg);
    return data;
  },
  //ファイルに書き込みを行う
  runWritefile_render: async (arg: any) => {
    const data: any = await ipcRenderer.invoke("runWritefile", arg);
    return data;
  },

  changeView: (viewName: string) => {
    ipcRenderer.send("change_view", viewName);
  },

  //timerを更新
  onTimerTick: async (func: any) => {
    //初期化
    ipcRenderer.removeAllListeners("TimerTick");
    //rendererでの受信用, funcはコールバック関数
    ipcRenderer.on("TimerTick", (event, arg) => {
      func(arg);
    });
  },

  //クリップボードに書き込む
  copyClipboard: async (arg: string) => {
    await ipcRenderer.send("copyClipboard", arg);
  },
  //クリップボードを読み込む
  readClipboard: async () => {
    const data: any = await ipcRenderer.invoke("readClipboard");
    return data;
  },

  //loginDialogを開く
  openLoginDialog: () => {
    ipcRenderer.send("openLoginDialog");
  },
  //selectDafaultcontestを開く
  openselectDafaultcontest: () => {
    ipcRenderer.send("openselectDafaultcontest");
  },
});
/**
 * editorに関するIPC
 */
contextBridge.exposeInMainWorld("editor", {
  // editorに向けてイベントを送信

  createModel: (func: any) => {
    ipcRenderer.on("createModel", (event, arg: createEditorModelType) => {
      func(arg);
    });
  },
  setModel: (func: any) => {
    ipcRenderer.on("setModel", (event, id: string) => {
      func(id);
    });
  },
  changeValue: (func: any) => {
    ipcRenderer.on("changeValue", (event, arg: syncEditorType) => {
      func(arg);
    });
  },
  changeLanguage: (func: any) => {
    ipcRenderer.on("changeLanguage", (event, arg: languagetype) => {
      func(arg);
    });
  },
  closeModel: (func: any) => {
    ipcRenderer.on("closeModel", (event, id: string) => {
      func(id);
    });
  },

  // Mainからイベントを送ってデータを取得

  getValue: async (func: any) => {
    ipcRenderer.on("getValue", (event, arg: languagetype) => {
      func(arg);
    });
  },
  getValue_replay: (value: string) => {
    ipcRenderer.send("getValue_replay", value);
  },

  // mainに送信
  createTaskCont: (arg: createTaskContType) => {
    ipcRenderer.send("createTaskCont", arg);
  },
  save: (id: string) => {
    ipcRenderer.send("save", id);
  },

  // renderから送信してデータを取得 handle invoke
  getdefaultLanguage: async () => {
    const dafaultlanguage: string = await ipcRenderer.invoke(
      "getdefaultLanguage"
    );
    return dafaultlanguage;
  },
  setdefaultLanguage: (language: languagetype) => {
    ipcRenderer.send("setdefaultLanguage", language);
  },
  submitNowTop: () => {
    ipcRenderer.send("submitNowTop");
  },
});
/**
 * submissionsに関するIPC
 */
contextBridge.exposeInMainWorld("submissions", {
  updateSubmissions: () => {
    ipcRenderer.send("updateSubmissions");
  },
  submissionsReturn: (func: any) => {
    ipcRenderer.on("submissionsReturn", (event, arg) => {
      func(arg);
    });
  },
});
