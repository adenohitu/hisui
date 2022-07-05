export interface languagesInfo {
  [languagetype: string]: {
    languagename: string;
    submitLanguageId: number;
    extension: string;
  };
}
// 言語とその拡張子を管理
export const languages: languagesInfo = {
  cpp: { languagename: "C++", submitLanguageId: 4003, extension: ".cpp" },
  python: { languagename: "Python3", submitLanguageId: 4006, extension: ".py" },
  rust: { languagename: "Rust", submitLanguageId: 4050, extension: ".rs" },
};
/**
 * Editorが対応する言語
 */
export type languagetype = "cpp" | "python" | "rust" | string;
