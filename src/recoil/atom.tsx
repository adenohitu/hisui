import { atom } from "recoil";

// setContest
export const defaultContestIDState = atom<string>({
  key: "defaultContestID",
  default: "",
});
