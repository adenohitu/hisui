/*!
 *======================================================================
 *Project Name    : Hisui
 *File Name       : cppintellisense_test.ts
 *Copyright © 2021-2022 adenohitu. All rights reserved.
 *======================================================================
 */
/* eslint-disable no-template-curly-in-string */
// snippetを追加するサンプル
import { Monaco } from "@monaco-editor/react";
import { IRange, languages } from "monaco-editor";
import { languagetype } from "../../../../src_main/file/extension";
import { snippetObject } from "./sample";

export function addSnippet(
  monaco: Monaco,
  language: languagetype,
  snippetIn: snippetObject
) {
  function createDependencyProposals(
    range: IRange
  ): languages.CompletionItem[] {
    return Object.keys(snippetIn).map((key) => {
      return {
        label: snippetIn[key].prefix,
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: snippetIn[key].documentation,
        detail: snippetIn[key].description,
        insertText: snippetIn[key].body.join("\n"),
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
      };
    });
  }

  return monaco.languages.registerCompletionItemProvider(language, {
    provideCompletionItems: function (model, position) {
      var word = model.getWordUntilPosition(position);
      var range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      // 頭文字にSnippetに登録されているものがなければから配列を返す
      var textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      const match = Object.keys(snippetIn).find((arg) => {
        if (arg.slice(0, 1) === textUntilPosition) {
          return true;
        } else {
          return false;
        }
      });
      const sugdata =
        (match !== undefined && createDependencyProposals(range)) || [];

      return {
        suggestions: sugdata,
      };
    },
  });
}
// function test(monaco: Monaco) {
//   monaco.languages.registerInlineCompletionsProvider("cpp", {});
// }
