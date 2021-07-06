export interface servicestatus {
  // アプリを使っても良いか
  useapp: boolean;
  // アプリの状態
  // ok:正常,warning:危険,stop:停止中(useappがFalseの時)
  status: "ok" | "warning" | "stop";
  // Statusがok以外の時のメッセージを設定する
  statusMessage: null | statusMessage;
}
export interface statusMessage {
  title: string;
  detail: string;
  // 202004290001
  // 日時の後にIDをつける
  statusID: number;
}
