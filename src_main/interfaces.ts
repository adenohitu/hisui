import { editor } from "monaco-editor";
export type returnLogin =
  | "already"
  | "success"
  | "Failure_Postdata"
  | "Failure_requestError";
export type returnLogout =
  | "success"
  | "Failure_Postdata"
  | "Failure_requestError";
export type returnSubmit = "CodeisEmpty" | "success" | "Failure_requestError";

export interface returnStandingsData {
  cache: boolean;
  login: boolean;
  time: number;
  data: any | undefined;
}
/**
 * 問題固有のID
 * abc220_a 等
 */
export type taskScreenName = string;
/**
 * コンテスト固有のID
 * abc220 等
 */
export type contestName = string;

export interface hisuiEditorChangeModelContentObject {
  nowmodelId: string;
  editorValue: string;
  eventArg: editor.IModelContentChangedEvent;
}
