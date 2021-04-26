import React, { useEffect, useRef, useState } from "react";
// import path from "path";
import Editor, { loader, useMonaco } from "@monaco-editor/react";
import { useDispatch, useSelector } from "react-redux";
import { saveValue, selecteditorvalue } from "../../app/Slice/editor";

//cdnを使わずローカルファイルから読み込ませる
loader.config({
  paths: { vs: "./monaco-editor/min/vs" },
});

export function MainEditor() {
  const editorvalue = useSelector(selecteditorvalue);
  const editorRef: any = useRef(null);
  const [lang, setlang] = useState("python");

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  function showValue() {
    return editorRef.current.getValue();
  }
  const monaco = useMonaco();

  useEffect(() => {
    // do conditional chaining
    monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    // or make sure that it exists by other ways
    if (monaco) {
      console.log("here is the monaco instance:", monaco);
    }
  }, [monaco]);

  const dispatch = useDispatch();
  function viewmodule() {
    console.log(monaco?.editor.getModels());
  }
  function makemodule() {
    console.log(monaco?.editor.createModel("", "text/plain").id);
  }

  return (
    <>
      <button
        onClick={() => {
          dispatch(saveValue(showValue()));
        }}
      >
        save
      </button>
      <button
        onClick={() => {
          setlang("cpp");
        }}
      >
        changecpp
      </button>
      <button
        onClick={() => {
          viewmodule();
        }}
      >
        viewmodule
      </button>
      <button
        onClick={() => {
          makemodule();
        }}
      >
        make
      </button>
      <Editor
        height="100%"
        language={lang}
        value={editorvalue}
        onMount={handleEditorDidMount}
      />
    </>
  );
}
