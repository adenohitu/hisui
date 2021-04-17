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

export function MainEditor() {
  const [editorvalue, seteditorvalue] = useState("");
  const [ID, setid] = useState("");
  const [task, settask] = useState("");
  useEffect(() => {
    const getid = async () => {
      setid(await window.api.get_SetContestID_render());
    };
    getid();
  }, []);

  function handleEditorChange(value: any, event: any) {
    console.log("here is the current model value:", value);
    seteditorvalue(value);
  }

  return (
    <>
      <input value={ID}></input>
      <input
        value={task}
        onChange={(event) => {
          settask(event.target.value);
        }}
      ></input>
      <button
        onClick={async () => {
          const data = await window.api.getFiledata_render({
            contestname: ID,
            taskname: task,
            launage: "cpp",
          });
          console.log(data);
          seteditorvalue(data);
        }}
      >
        update
      </button>
      <button
        onClick={async () => {
          await window.api.runWritefile_render({
            data: editorvalue,
            contestname: ID,
            taskname: task,
            launage: "cpp",
          });
        }}
      >
        save
      </button>
      <Editor
        height="90vh"
        defaultLanguage="cpp"
        value={editorvalue}
        onChange={handleEditorChange}
      />
    </>
  );
}
