import React, { useEffect, useRef, useState } from "react";
// import path from "path";
import Editor, { loader, Monaco, useMonaco } from "@monaco-editor/react";
// import { useSelector } from "react-redux";
// import { selecteditorvalue } from "../../app/Slice/editor";
// import { EditorToolbar } from "./toolbar";
import { monacoControlApi } from "./monacoapi";
import { editor } from "monaco-editor";
//cdnを使わずローカルファイルから読み込ませる
loader.config({
  paths: { vs: "./monaco-editor/min/vs" },
});

export function MainEditor() {
  // const editorvalue = useSelector(selecteditorvalue);
  const editorRef: any = useRef(null);
  // eslint-disable-next-line
  const [lang, setlang] = useState("python");

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;
    //editorInstanceをapiに設定
    monacoControlApi.setEditorInstance(editorRef.current);
  }

  function handleEditorWillMount(monaco: Monaco) {
    // here is the monaco instance
    // do something before editor is mounted
    // マウント前のインスタンスを取得
    // テーマなどの指定が可能
    console.log(monaco.editor);
  }
  // マウント後のインスタンス
  const monaco = useMonaco();
  useEffect(() => {
    //apiにinstanceを設定
    monacoControlApi.setuseMonaco(monaco);
  }, [monaco]);

  return (
    <div style={{ height: "100%" }}>
      {/* <EditorToolbar /> */}
      <Editor
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
      />
    </div>
  );
}
