import React, { useEffect, useRef } from "react";
// import path from "path";
import Editor, { loader, Monaco, useMonaco } from "@monaco-editor/react";
// import { useSelector } from "react-redux";
// import { selecteditorvalue } from "../../app/Slice/editor";
// import { EditorToolbar } from "./toolbar";
import { editor } from "monaco-editor";
import { monacocontrol } from "./monacoapi";
import { IContextMenuDelegate } from "../../../src_main/menu/monaco-context";
import { ipcRendererManager } from "../../ipc";
import { MenuElement } from "../../../src_main/menu/context-menu";
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
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      {/* <EditorToolbar /> */}
      <Editor
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
        height="100%"
        // LSPの補完よりスニペットが上に来るように
        options={{ snippetSuggestions: "top", contextmenu: true }}
        overrideServices={{
          contextMenuService: {
            showContextMenu: (b: IContextMenuDelegate) => {
              const getactions = b.getActions();
              const menu: MenuElement[] = getactions.map((ele) => {
                return {
                  id: ele.id,
                  label: ele.label,
                  tooltip: ele.tooltip,
                  class: ele.class,
                  enabled: ele.enabled,
                  checked: ele.checked,
                  Keybinding:
                    b.getKeyBinding &&
                    b.getKeyBinding(ele)?.getElectronAccelerator(),
                };
              });
              ipcRendererManager.send("OPEN_CONTEXT_MENU", menu);
              ipcRendererManager.on(
                "EDITOR_CONTEXT_ACTION",
                (e, id) => {
                  getactions.find((ele) => ele.id === id)?.run();
                },
                true
              );
            },
          },
        }}
      />
    </div>
  );
}
