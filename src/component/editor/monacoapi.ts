import { editor, IDisposable } from "monaco-editor";
import { createEditorModelType } from "../../../src_main/editor/taskcont";
import { languagetype } from "../../../src_main/file/extension";
import { ipcRendererManager } from "../../ipc";
import { addSnippet } from "./monaco/cppintellisense_test";
import { listen } from "@codingame/monaco-jsonrpc";
import {
  MonacoLanguageClient,
  MessageConnection,
  CloseAction,
  ErrorAction,
  MonacoServices,
  createConnection,
} from "monaco-languageclient";
import ReconnectingWebSocket from "reconnecting-websocket";
import { hisuiEditorChangeModelContentObject } from "../../../src_main/interfaces";
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
  snippetDisposeObject: { [language: string]: IDisposable };
  /**
   * editorのモデルを保持
   */
  editorModels: {
    [id: string]: {
      model: editor.ITextModel;
      state: editor.ICodeEditorViewState | null;
    };
  } = {};
  constructor() {
    this.monaco = null;
    this.editorInstance = null;
    this.nowmodelId = null;
    this.snippetDisposeObject = {};
    // ipcの受付セットアップ
    this.ipcSetup();
    this.setupSnippet();
  }

  /**
   * useMonacoを取得
   */
  setuseMonaco(monacoapi: useMonaco | null) {
    this.monaco = monacoapi;
    if (monacoapi) {
      ipcRendererManager.send("RUN_RELOAD_SNIPPET");
      this.setupLSP(monacoapi);
    }
  }
  setupSnippet() {
    ipcRendererManager.on(
      "LISTENER_CHANGE_EDITOR_SNIPPET",
      (e, lang: languagetype, snippet) => {
        console.log(snippet);

        if (this.snippetDisposeObject[lang]) {
          this.snippetDisposeObject[lang].dispose();
          delete this.snippetDisposeObject[lang];
        }
        if (this.monaco) {
          this.snippetDisposeObject[lang] = addSnippet(
            this.monaco,
            lang,
            snippet
          );
        }
      },
      true
    );
  }
  /**
   * editorInstanceを取得
   */
  setEditorInstance(inputInstance: editor.IStandaloneCodeEditor) {
    // editoeModelの中身が更新された時、IPCEventを発行
    inputInstance.onDidChangeModelContent((event) => {
      // Modelがセットされていない時無視する
      if (this.nowmodelId !== null) {
        const value = this.getValue(this.nowmodelId);
        const changeData: hisuiEditorChangeModelContentObject = {
          nowmodelId: this.nowmodelId,
          editorValue: value,
          eventArg: event,
        };
        ipcRendererManager.send("EDITOR_MODEL_CONTENTS_CHANGE", changeData);
      }
    });
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
        if (currentModel !== null) {
          // 保存する
          this.editorModels[this.nowmodelId] = {
            model: currentModel,
            state: currentState,
          };
        }
      }
      // 変更するモデルをセット
      this.editorInstance.setModel(this.editorModels[id].model);
      const state = this.editorModels[id].state;
      if (state) {
        this.editorInstance.restoreViewState(state);
      }
      this.nowmodelId = id;
      this.editorInstance.focus();
    }
  }
  saveNowModel() {
    if (this.nowmodelId !== null && this.editorInstance) {
      // モデルとStateを取得
      const currentModel = this.editorInstance.getModel();
      const currentState = this.editorInstance.saveViewState();
      if (currentModel !== null) {
        // 保存する
        this.editorModels[this.nowmodelId] = {
          model: currentModel,
          state: currentState,
        };
      }
    }
  }
  getNowModelLang() {
    return this.editorInstance?.getModel()?.getLanguageId();
  }
  /**
   * 新しいモデルを作成
   */
  createModel(id: string, data: string, language: string, path: string) {
    if (this.monaco && this.editorInstance) {
      // モデルを作成
      const createmodel = this.monaco.editor.createModel(
        data,
        language,
        this.monaco.Uri.file(path)
      );
      // モデルをeditorModelsに保存
      this.editorModels[id] = { model: createmodel, state: null };
      // モデルをEditorにセット
      // モデル作成終了のタイミングがMain側でわからないためCreateの時はRender側でセットする
      this.setModel(id);
    }
  }

  /**
   * モデルを削除
   */
  deleteModel(id: string) {
    this.editorModels[id].model.dispose();
    delete this.editorModels[id];
  }

  /**
   * 指定したモデルのValueを取得
   */
  getValue(id: string) {
    const data = this.editorModels[id].model.getValue();
    return data;
  }
  /**
   * 指定したモデルのValueを更新
   */
  changeValue(id: string, value: string) {
    const data = this.editorModels[id].model.setValue(value);
    return data;
  }

  /**
   * 指定したモデルの言語を変更
   */
  changeLanguage(id: string, language: string) {
    if (this.monaco) {
      this.monaco.editor.setModelLanguage(
        this.editorModels[id].model,
        language
      );
    }
  }

  /**
   * エデイターのデータを保存する
   */
  saveNowValue() {
    const taskid = this.nowmodelId;
    if (taskid !== null) {
      ipcRendererManager.send("RUN_SAVE_TASKCONT", taskid);
    }
  }

  /**
   * ipc通信のセットアップ
   * 受信
   */
  async ipcSetup() {
    // createModelの受付
    ipcRendererManager.on(
      "CREATE_EDITOR_MODEL",
      (e, arg: createEditorModelType) => {
        this.createModel(arg.id, arg.value, arg.language, arg.path);
      }
    );
    ipcRendererManager.on("SET_EDITOR_MODEL", (e, id: string) => {
      this.setModel(id);
    });
    ipcRendererManager.on("LISTENER_EDITOR_MODEL_REMOVE", (e, id: string) => {
      this.deleteModel(id);
    });
    // changeValueの受付
    ipcRendererManager.on("CHANGE_EDITOR_VALUE", (e, arg) => {
      console.log(arg);
      this.changeValue(arg.id, arg.value);
    });
    // language変更の受付
    ipcRendererManager.on("CHANGE_EDITOR_LANGUAGE", (e, arg) => {
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
  setupLSP(monacoapi: useMonaco) {
    function createLanguageClient(
      connection: MessageConnection
    ): MonacoLanguageClient {
      return new MonacoLanguageClient({
        name: "Sample Language Client",
        clientOptions: {
          // use a language id as a document selector
          documentSelector: ["cpp"],
          // disable the default error handler
          errorHandler: {
            error: () => ErrorAction.Continue,
            closed: () => CloseAction.DoNotRestart,
          },
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
          get: (errorHandler, closeHandler) => {
            return Promise.resolve(
              createConnection(connection, errorHandler, closeHandler)
            );
          },
        },
      });
    }

    function createWebSocket(url: string) {
      const socketOptions = {
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000,
        reconnectionDelayGrowFactor: 1.3,
        connectionTimeout: 10000,
        maxRetries: Infinity,
        debug: false,
      };
      return new ReconnectingWebSocket(url, [], socketOptions);
    }

    monacoapi.languages.register({
      id: "cpp",
      extensions: [".cpp"],
      aliases: ["c++", "cpp"],
    });
    MonacoServices.install(monacoapi);

    // create the web socket
    const url = "ws://localhost:49154/cpp";
    const webSocket: any = createWebSocket(url);
    // listen when the web socket is opened
    listen({
      webSocket,
      onConnection: (connection) => {
        // create and start the language client
        const languageClient = createLanguageClient(connection);
        const disposable = languageClient.start();
        connection.onClose(() => disposable.dispose());
      },
    });
  }
}
// export const monacoControlApi = new monacocontrol();
