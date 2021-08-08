/* eslint-disable no-template-curly-in-string */
// snippetを追加するサンプル
import { Monaco } from "@monaco-editor/react";

export function cppAddIntellisence(monaco: Monaco) {
  function createDependencyProposals(range: any) {
    // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
    // here you could do a server side lookup
    return [
      {
        label: "for",
        prefix: "for",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "forの補完",
        insertText: ["for (int i = $1; i < $2; i++){", "\t$0", "}"].join("\n"),
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
      },
    ];
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
        label: '"my-third-party-library"',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Describe your library here",
        insertText: '"${1:my-third-party-library}": "${2:1.2.3}"',
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
