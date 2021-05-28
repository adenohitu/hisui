import { editor } from "monaco-editor";
type useMonaco = typeof import("monaco-editor/esm/vs/editor/editor.api");

export class monacocontrol {
  monaco: useMonaco | null;
  editorInstance: editor.IStandaloneCodeEditor | null;
  nowmodel: string | null;
  modelState: any;

  editorModelId: { [id: string]: any } = {};
  constructor() {
    this.monaco = null;
    this.editorInstance = null;
    this.nowmodel = null;
    this.modelState = {};
  }
  /**
   * useMonacoを保持する
   */
  setuseMonaco(monacoapi: useMonaco | null) {
    this.monaco = monacoapi;
  }
  /**
   * editorInstanceを保持する
   */
  setEditorInstance(inputInstance: editor.IStandaloneCodeEditor | null) {
    this.editorInstance = inputInstance;
  }

  // ipcを使ってファイルのデータを取得してEditorModelを作成
  async runOpenFile(contestname: string, taskname: string, language: string) {
    const fileData: any = await window.api.getFiledata_render({
      contestname,
      taskname,
      language,
    });
    const model = this.monaco?.editor.createModel(fileData, language);
    return model;
  }

  // editorにModelをセットする
  setModel(model: editor.ITextModel) {
    console.log(model);

    this.editorInstance?.setModel(model);
    // this.editorInstance.restoreViewState()
    this.editorInstance?.focus();
  }
}
export const monacoControlApi = new monacocontrol();
