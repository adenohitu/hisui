import { atom } from "recoil";

// EditorStatus
export const contestNameState = atom<string>({
  key: "editorStatus-contestName",
  default: "",
});
export const taskScreenNameState = atom<string>({
  key: "editorStatus-TaskScreenName",
  default: "",
});
export const AssignmentNameState = atom<string>({
  key: "editorStatus-AssignmentName",
  default: "",
});
export const languageState = atom<string>({
  key: "editorStatus-language",
  default: "",
});
export const submitLanguageState = atom<string>({
  key: "editorStatus-submitLanguage",
  default: "",
});
export const taskcodeByteState = atom<number | string>({
  key: "editorStatus-taskcodeByte",
  default: "",
});
