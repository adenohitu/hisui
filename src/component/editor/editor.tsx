import React, { useRef } from "react";
// import path from "path";
import Editor, { loader } from "@monaco-editor/react";
import { useDispatch, useSelector } from "react-redux";
import { saveValue, selecteditorvalue } from "../../app/Slice/editor";
// loader.config({
//   paths: { vs: "./node_modules/monaco-editor/min/vs" },
// });

//cdnを使わずローカルファイルから読み込ませる
loader.config({
  paths: { vs: "./monaco-editor/min/vs" },
});

export function MainEditor() {
  const editorvalue = useSelector(selecteditorvalue);
  const editorRef: any = useRef(null);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  function showValue() {
    return editorRef.current.getValue();
  }
  const dispatch = useDispatch();

  return (
    <>
      {/* <button
        onClick={() => {
          dispatch(saveValue(showValue()));
        }}
      >
        save
      </button> */}
      <Editor
        height="100%"
        defaultLanguage="python"
        value={editorvalue}
        onMount={handleEditorDidMount}
      />
    </>
  );
}
