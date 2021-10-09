// 言語とその拡張子を管理
export const languages = {
  cpp: { submitLanguageId: 4003, extension: ".cpp" },
  python: { submitLanguageId: 4006, extension: ".py" },
};
export type languagetype = keyof typeof languages;
