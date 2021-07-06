// snippetを追加するサンプル
import { Monaco } from "@monaco-editor/react";

export function cppAddIntellisence(monaco: Monaco) {
  function createDependencyProposals(range: any) {
    // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
    // here you could do a server side lookup
    return [
      {
        label: "for: Array",
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: "Iterate over an Array",
        insertText: [
          "for(let i=0; i < arr.length; i++){",
          "\tlet elem = arr[i];",
          "",
          "}",
        ].join("\n"),
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
