import { type } from "os"; // eslint-disable-line
import { atcoderCodeTestResult } from "./casetester/runtest_atcoder";
import { createTaskContType } from "./editor/control";
import { syncEditorType, createEditorModelType } from "./editor/taskcont";
import { languagetype } from "./file/extension";
import { EventsArrey } from "./ipc/events";
const { contextBridge, ipcRenderer } = require("electron");
//分離されたプリロードスクリプト

/**
 * editorに関するIPC
 */
contextBridge.exposeInMainWorld("editor", {
  // editorに向けてイベントを送信

  createModel: (func: any) => {
    ipcRenderer.on("createModel", (event, arg: createEditorModelType) => {
      func(arg);
    });
  },
  setModel: (func: any) => {
    ipcRenderer.on("setModel", (event, id: string) => {
      func(id);
    });
  },
  changeValue: (func: any) => {
    ipcRenderer.on("changeValue", (event, arg: syncEditorType) => {
      func(arg);
    });
  },
  changeLanguage: (func: any) => {
    ipcRenderer.on("changeLanguage", (event, arg: languagetype) => {
      func(arg);
    });
  },
  closeModel: (func: any) => {
    ipcRenderer.on("closeModel", (event, id: string) => {
      func(id);
    });
  },

  // Mainからイベントを送ってデータを取得

  getValue: async (func: any) => {
    ipcRenderer.on("getValue", (event, arg: languagetype) => {
      func(arg);
    });
  },
  getValue_replay: (TaskScreenName: string, value: string) => {
    const channel = `getValue_replay-${TaskScreenName}`;

    ipcRenderer.send(channel, value);
  },

  // mainに送信
  createTaskCont: (arg: createTaskContType) => {
    ipcRenderer.send("createTaskCont", arg);
  },
  save: (id: string) => {
    ipcRenderer.send("save", id);
  },

  // renderから送信してデータを取得 handle invoke
  getdefaultLanguage: async () => {
    const dafaultlanguage: string = await ipcRenderer.invoke(
      "getdefaultLanguage"
    );
    return dafaultlanguage;
  },
  setdefaultLanguage: (language: languagetype, load: boolean) => {
    ipcRenderer.send("setdefaultLanguage", language, load);
  },
  submitNowTop: () => {
    ipcRenderer.send("submitNowTop");
  },
  runcodeTestNowTop: (samplecase: string, answer: string | null = null) => {
    ipcRenderer.send("runcodeTestNowTop", samplecase, answer);
  },
  // コードテストの結果に更新があったら受け取る
  codeTestStatusEvent: async (func: (arg: atcoderCodeTestResult) => void) => {
    ipcRenderer.on(
      "codeTestStatusEvent",
      (event, arg: atcoderCodeTestResult) => {
        func(arg);
      }
    );
  },
});

const obj = EventsArrey.reduce((result: { [name: string]: any }, current) => {
  if (current[1].mode === "send") {
    result[current[0]] = (
      listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void,
      only?: boolean
    ) => {
      if (only === true) {
        ipcRenderer.removeAllListeners(current[0]);
      }
      ipcRenderer.on(current[0], listener);
      return () => {
        ipcRenderer.removeListener(current[0], listener);
      };
    };
    return result;
  } else if (current[1].mode === "handle") {
    result[current[0]] = async (...args: any[]) => {
      const data = await ipcRenderer.invoke(current[0], ...args);
      return data;
    };
    return result;
  } else if (current[1].mode === "on") {
    result[current[0]] = (...args: any[]) => {
      ipcRenderer.send(current[0], ...args);
    };
    return result;
  } else {
    return result;
  }
}, {});
contextBridge.exposeInMainWorld("ipc", obj);
