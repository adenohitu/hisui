import { editor } from "monaco-editor";
import {
  cppAddIntellisence,
  pythonAddIntellisence,
} from "./monaco/cppintellisense_test";
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
   * editorのモデルを保持
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
    // ipcの受付セットアップ
    this.ipcSetup();
  }

  /**
   * useMonacoを取得
   */
  setuseMonaco(monacoapi: useMonaco | null) {
    this.monaco = monacoapi;
    if (this.monaco) {
      cppAddIntellisence(this.monaco);
      pythonAddIntellisence(this.monaco);
    }
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
  setModel(id: string) {
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
  createModel(id: string, data: string, language: string) {
    if (this.monaco) {
      // モデルを作成
      const createmodel = this.monaco.editor.createModel(data, language);
      // モデルを保存
      this.editorModel[id] = { model: createmodel, state: null };
      // モデルをEditorにセット
      // モデル作成終了のタイミングがMain側でわからないためCreateの時はRender側でセットする
      this.editorInstance?.setModel(createmodel);
    }
  }

  /**
   * モデルを削除
   */
  deleteModel(id: string) {
    if (id !== this.nowmodelId) {
      this.editorModel[id].model.dispose();
      delete this.editorModel[id];
    }
  }

  /**
   * 指定したモデルのValueを取得
   */
  getValue(id: string) {
    const data = this.editorModel[id].model.getValue();
    return data;
  }
  /**
   * 指定したモデルのValueを更新
   */
  changeValue(id: string, value: string) {
    const data = this.editorModel[id].model.setValue(value);
    return data;
  }

  /**
   * 指定したモデルの言語を変更
   */
  changeLanguage(id: string, language: string) {
    if (this.monaco) {
      this.monaco.editor.setModelLanguage(this.editorModel[id].model, language);
    }
  }

  /**
   * エデイターのデータを保存する
   */
  saveNowValue() {
    const taskid = this.nowmodelId;
    if (taskid !== null) {
      // mainのTaskContで保存イベントを発生させるよう
      window.editor.save(taskid);
    }
  }

  /**
   * ipc通信のセットアップ
   * 受信
   */
  async ipcSetup() {
    // createModelの受付
    window.editor.createModel((arg: any) => {
      this.createModel(arg.id, arg.value, arg.language);
    });
    // setModelの受付
    window.editor.setModel((id: string) => {
      this.setModel(id);
    });
    // changeValueの受付
    window.editor.changeValue((arg) => {
      this.changeValue(arg.id, arg.value);
    });
    // language変更の受付
    window.editor.changeLanguage((arg) => {
      console.log(arg);

      this.changeLanguage(arg.id, arg.language);
    });
    // ipc送受信
    // mainからValueを送信するように指示される
    window.editor.getValue((id) => {
      const Value = this.getValue(id);
      // Valueを返す
      window.editor.getValue_replay(id, Value);
    });
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
// export const monacoControlApi = new monacocontrol();
