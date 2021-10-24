import React, { useEffect, useRef } from "react";
// import path from "path";
import Editor, { loader, Monaco, useMonaco } from "@monaco-editor/react";
// import { useSelector } from "react-redux";
// import { selecteditorvalue } from "../../app/Slice/editor";
// import { EditorToolbar } from "./toolbar";
import { editor } from "monaco-editor";
import { monacocontrol } from "./monacoapi";
//cdnを使わずローカルファイルから読み込ませる
loader.config({
  paths: { vs: "./vs" },
});
export let monacoControlApi: null | monacocontrol = null;

export function MainEditor() {
  useEffect(() => {
    monacoControlApi = new monacocontrol();
  }, []);

  // const editorvalue = useSelector(selecteditorvalue);
  const editorRef: any = useRef(null);

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;
    //editorInstanceをapiに設定
    monacoControlApi?.setEditorInstance(editorRef.current);
  }

  function handleEditorWillMount(monaco: Monaco) {
    // here is the monaco instance
    // do something before editor is mounted
    // マウント前のインスタンスを取得
    // テーマなどの指定が可能
    console.log(monaco.editor);
  }
  // MonacoAPI
  const monaco = useMonaco();
  useEffect(() => {
    //apiにinstanceを設定
    monacoControlApi?.setuseMonaco(monaco);
  }, [monaco]);

  return (
    <div style={{ height: "100%" }}>
      {/* <EditorToolbar /> */}
      <Editor
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
        // LSPの補完よりスニペットが上に来るように
        options={{ snippetSuggestions: "top" }}
      />
    </div>
  );
}
