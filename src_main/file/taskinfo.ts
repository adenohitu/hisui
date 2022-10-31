import { languagetype } from "./extension";
type serviceId = "atcoder";
/**
 * serviceMGTがCreateTaskContに渡す情報
 */
export interface serviceMgtTaskInfo {
  service: serviceId;
  taskGroup: string;
  taskID: string;
  taskURL: string;
}
/**
 * コードが保存されているファイルと同じ階層の "taskinfo.json"
 * に記載される情報
 */
export interface taskCodeInfo {
  // --必須データ--
  // 問題が公開されているサービス(Hisuiが対応しているもののみ)
  service: serviceId;
  // 問題が含まれるグループ ex:"abc219"(contestName)
  taskGroup: string;
  // 問題固有のID ex:"abc219_a"(TaskScreenName)
  taskID: string;

  // 問題を閲覧することのできるURL
  taskURL: string;

  // --必須ではないデータ--
  // エディタで使用する言語
  editorInfo: {
    languagetype: languagetype;
  };
  // ジャッジシステムに提出するために必要な情報
  submitInfo?: {
    languagetype?: string;
    languageId?: string;
  };
}

export interface taskinfos {
  [filename: string]: taskCodeInfo;
}
