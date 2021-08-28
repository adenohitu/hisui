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
import { snippet } from "./sample";

export function cppAddIntellisence(monaco: Monaco) {
  function createDependencyProposals(range: any) {
    let testData = snippet;
    let newarrey: any = [];
    Object.keys(testData).forEach((key) => {
      newarrey.push({
        label: key,
        prefix: testData[key].prefix,
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "",
        insertText: testData[key].body.join("\n"),
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
      });
    });
    console.log(newarrey);

    return newarrey;
  }
  monaco.languages.registerCompletionItemProvider("cpp", {
    provideCompletionItems: function (model, position) {
      // find out if we are completing a property in the 'dependencies' object.
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
export function pythonAddIntellisence(monaco: Monaco) {
  function createDependencyProposals(range: any) {
    // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
    // here you could do a server side lookup
    return [
      {
        label: "print",
        prefix: "print",
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "標準出力",
        insertText: ["print(${1:})"].join("\n"),
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
      },
      {
        label: "input",
        prefix: "input",
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "標準入力",
        insertText: ["input()"].join("\n"),
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
      },
    ];
  }

  monaco.languages.registerCompletionItemProvider("python", {
    provideCompletionItems: function (model, position) {
      // find out if we are completing a property in the 'dependencies' object.
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
