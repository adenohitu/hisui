import React, { useEffect, useState } from "react";
// import path from "path";
import Editor, { loader } from "@monaco-editor/react";
// loader.config({
//   paths: { vs: "./node_modules/monaco-editor/min/vs" },
// });

//cdnを使わずローカルファイルから読み込ませる
loader.config({
  paths: { vs: "./monaco-editor/min/vs" },
});
const files: any = {
  "script.js": {
    name: "script.js",
    language: "javascript",
    value: "script.js",
  },
  "style.css": {
    name: "style.css",
    language: "css",
    value: "style.css",
  },
  "index.html": {
    name: "index.html",
    language: "html",
    value: "index.html",
  },
};
export function MainEditor() {
  const [fileName, setFileName]: any = useState("script.js");
  const file = files[fileName];
  useEffect(() => {
    console.log();
  }, []);
  return (
    <>
      <div>
        <button
          disabled={fileName === "script.js"}
          onClick={() => setFileName("script.js")}
        >
          script.js
        </button>
        <button
          disabled={fileName === "style.css"}
          onClick={() => setFileName("style.css")}
        >
          style.css
        </button>
        <button
          disabled={fileName === "index.html"}
          onClick={() => setFileName("index.html")}
        >
          index.html
        </button>
      </div>
      <Editor
        height="100%"
        loading={"loading..."}
        path={file.name}
        defaultLanguage={file.language}
        defaultValue={file.value}
      />
    </>
  );
}
