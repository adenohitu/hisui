/*!
 *======================================================================
 *Project Name    : Hisui
 *File Name       : cppintellisense_test.ts
 *Copyright © 2021 adenohitu. All rights reserved.
 *======================================================================
 */
/* eslint-disable no-template-curly-in-string */
// snippetを追加するサンプル
import { Monaco } from "@monaco-editor/react";
import { languages } from "monaco-editor";
import { languagetype } from "../../../../src_main/file/extension";
import { snippetObject } from "./sample";

export function addSnippet(
  monaco: Monaco,
  language: languagetype,
  snippetIn: snippetObject
) {
  function createDependencyProposals(range: any) {
    let testData = snippetIn;
    let newarrey: languages.CompletionItem[] = [];
    Object.keys(testData).forEach((key) => {
      newarrey.push({
        label: testData[key].prefix,
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: key,
        insertText: testData[key].body.join("\n"),
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
      });
    });
    return newarrey;
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
