import { editor, IDisposable, languages } from "monaco-editor";
import { createEditorModelType } from "../../../src_main/editor/taskcont";
import { languagetype } from "../../../src_main/file/extension";
import { ipcRendererManager } from "../../ipc";
import { addSnippet } from "./monaco/cppintellisense_test";

import {
  MonacoLanguageClient,
  CloseAction,
  ErrorAction,
  MonacoServices,
  createConnection,
} from "monaco-languageclient";
import {
  createMessageConnection,
  DataCallback,
  Disposable,
  Message,
  MessageConnection,
  MessageReader,
  MessageWriter,
  Trace,
} from "vscode-jsonrpc";
import { hisuiEditorChangeModelContentObject } from "../../../src_main/interfaces";
import { IpcEventsKey } from "../../../src_main/ipc/events";
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
      ipcRendererManager.send("MONACO_READY");
      this.startLSP(monacoapi);
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
    // ipc送受信
    // mainからValueを送信するように指示される
    window.editor.getValue((id) => {
      const Value = this.getValue(id);
      // Valueを返す
      window.editor.getValue_replay(id, Value);
    });
  }
  startLSP(monacoapi: useMonaco) {
    MonacoServices.install(monacoapi);

    ipcRendererManager.on(
      "LSP_READY",
      (e, arg: languages.ILanguageExtensionPoint, lspProcessPID) => {
        this.setupLSP(monacoapi, arg, lspProcessPID);
        console.log(arg, lspProcessPID);
      }
    );
  }
  setupLSP(
    monacoapi: useMonaco,
    languageExtention: languages.ILanguageExtensionPoint,
    lspProcessPID: string
  ) {
    monacoapi.languages.register(languageExtention);
    // dummy disposable to satisfy interfaces
    function dummyDisposable(): Disposable {
      return {
        dispose: () => void 0,
      };
    }
    // custom implementations of the MessageReader and MessageWriter to plug into a MessageConnection
    class RendererIpcMessageReader implements MessageReader {
      private subscribers: DataCallback[] = [];
      private handler = this.notifySubscribers.bind(this);
      private disposer: () => void | undefined;
      constructor(private channel: IpcEventsKey) {
        // listen to incoming language server notifications and messages from the backend
        this.disposer = ipcRendererManager.on(this.channel, (e, id, msg) => {
          if (id === lspProcessPID) {
            this.handler(e, msg);
          }
        });
      }

      // events are not implemented for this example
      public onError = () => dummyDisposable();
      public onClose = () => dummyDisposable();
      public onPartialMessage = () => dummyDisposable();

      public listen(callback: DataCallback): any {
        this.subscribers.push(callback);
      }

      public dispose(): void {
        this.disposer();
      }

      private notifySubscribers(event: any, msg: Message) {
        this.subscribers.forEach((s) => s(msg));
      }
    }

    class RendererIpcMessageWriter implements MessageWriter {
      constructor(private channel: IpcEventsKey) {}

      // events are not implemented for this example
      public onError = () => dummyDisposable();
      public onClose = () => dummyDisposable();

      public async write(msg: Message): Promise<void> {
        // send all requests for the language server to the backend
        ipcRendererManager.send(this.channel, lspProcessPID, msg);
      }

      public dispose(): void {
        // nothing to dispose
      }
      end() {}
    }
    // wire up the IPC connection
    const reader = new RendererIpcMessageReader("LSP_SEND");
    const writer = new RendererIpcMessageWriter("LSP_ON");
    const connection = createMessageConnection(reader, writer);

    // create and start the language client
    const client = createBaseLanguageClient(connection);
    client.start();

    function createBaseLanguageClient(connection: MessageConnection) {
      const client = new MonacoLanguageClient({
        clientOptions: {
          documentSelector: [languageExtention.id],
          errorHandler: {
            closed: () => CloseAction.DoNotRestart,
            error: () => ErrorAction.Continue,
          },
        },
        connectionProvider: {
          get: async (errorHandler, closeHandler) =>
            createConnection(connection, errorHandler, closeHandler),
        },
        name: `${languageExtention.id} language server`,
      });

      // for debugging
      client.trace = Trace.Messages;

      return client;
    }
  }
}
// export const monacoControlApi = new monacocontrol();
