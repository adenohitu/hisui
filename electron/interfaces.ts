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
