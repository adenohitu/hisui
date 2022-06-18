// 言語とその拡張子を管理
export const languages: {
  [languagetype: string]: { submitLanguageId: number; extension: string };
} = {
  cpp: { submitLanguageId: 4003, extension: ".cpp" },
  python: { submitLanguageId: 4006, extension: ".py" },
};
/**
 * Editorが対応する言語
 */
export type languagetype = "cpp" | "python" | string;
