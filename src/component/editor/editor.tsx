import React, { useEffect } from "react";
// import path from "path";
import Editor, { loader } from "@monaco-editor/react";
// loader.config({
//   paths: { vs: "./node_modules/monaco-editor/min/vs" },
// });

//cdnを使わずローカルファイルから読み込ませる
loader.config({
  paths: { vs: "./monaco-editor/min/vs" },
});
const testdata = `#include <bits/stdc++.h>
using namespace std;

int main() {
    int h, a;
    cin >> h >> a;
    int ans;
    ans = 0;
    while (h > 0) {
        h -= a;
        ans++;
    }
    cout << ans << endl;
    return 0;
}
`;
export function MainEditor() {
  useEffect(() => {
    console.log();
  }, []);
  return (
    <Editor
      height="100%" // By default, it fully fits with its parent
      theme={"light"}
      language={"cpp"}
      value={testdata}
      loading={"Loading..."}
    />
  );
}
