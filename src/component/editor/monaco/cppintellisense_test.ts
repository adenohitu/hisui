/*!
 *======================================================================
 *Project Name    : Hisui
 *File Name       : cppintellisense_test.ts
 *Copyright © 2020-2023 adenohitu. All rights reserved.
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
        kind: monaco.languages.CompletionItemKind.Function,
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
      return {
        suggestions: createDependencyProposals(range),
      };
    },
  });
}
// function test(monaco: Monaco) {
//   monaco.languages.registerInlineCompletionsProvider("cpp", {});
// }
