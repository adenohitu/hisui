import { editor } from "monaco-editor";
type useMonaco = typeof import("monaco-editor/esm/vs/editor/editor.api");

export class monacocontrol {
  /**
   * monacoのAPI
   */
  monaco: useMonaco | null;
  /**
   * editorのインスタンス
   */
  editorInstance: editor.IStandaloneCodeEditor | null;
  nowmodelId: string | null;
  /**
   * editorのモデルを保存
   */
  editorModel: {
    [id: string]: {
      model: editor.ITextModel;
      state: editor.ICodeEditorViewState | null;
    };
  } = {};
  constructor() {
    this.monaco = null;
    this.editorInstance = null;
    this.nowmodelId = null;
  }
  /**
   * useMonacoを取得
   */
  setuseMonaco(monacoapi: useMonaco | null) {
    this.monaco = monacoapi;
  }
  /**
   * editorInstanceを取得
   */
  setEditorInstance(inputInstance: editor.IStandaloneCodeEditor | null) {
    this.editorInstance = inputInstance;
  }

  /**
   * モデルをEditorにセット
   */
  async setModel(id: string) {
    if (this.editorInstance !== null) {
      // 今セットされているモデルを保存
      if (this.nowmodelId !== null) {
        // モデルとStateを取得
        const currentModel = this.editorInstance.getModel();
        const currentState = this.editorInstance.saveViewState();
        console.log(currentState);
        if (currentModel !== null) {
          // 保存する
          this.editorModel[this.nowmodelId] = {
            model: currentModel,
            state: currentState,
          };
        }
      }
      // 変更するモデルをセット
      this.editorInstance.setModel(this.editorModel[id].model);
      const state = this.editorModel[id].state;
      if (state) {
        this.editorInstance.restoreViewState(state);
      }
      this.nowmodelId = id;
      this.editorInstance.focus();
    }
  }

  /**
   * 新しいモデルを作成
   */
  async createModel(id: string, data: string, language: string) {
    if (this.monaco) {
      // モデルを作成
      const createmodel = this.monaco.editor.createModel(data, language);
      // モデルを保存
      this.editorModel[id] = { model: createmodel, state: null };
    }
  }

  /**
   * モデルを削除
   */
  async deleteModel(id: string) {
    if (id !== this.nowmodelId) {
      this.editorModel[id].model.dispose();
      delete this.editorModel[id];
    }
  }

  /**
   * サンプル
   * ipcを使ってファイルのデータを取得してEditorModelを作成
   */
  async runOpenFile(contestname: string, taskname: string, language: string) {
    const fileData: any = await window.api.getFiledata_render({
      contestname,
      taskname,
      language,
    });
    const model = this.monaco?.editor.createModel(fileData, language);
    return model;
  }
}
export const monacoControlApi = new monacocontrol();
