/**
 * Inspired by https://github.com/gins3000/monaco-electron-ipc-example
 */
import * as rpc from "vscode-ws-jsonrpc";
import { Message } from "vscode-jsonrpc";
import { fork } from "child_process";
import { ipcMainManager } from "../../ipc/ipc";
import path from "path";
import { app } from "electron";
import { monacoSettingApi } from "../monaco";
// import { getPortPromise } from "portfinder";

export interface languageServer {
  command: string[];
}
export type languageServers = { [key: string]: languageServer };

export async function setupLSP_Pyright() {
  // LSP起動
  const lsPath = path.join(getPyrightPath(), "langserver.index.js");
  const lsArgs = ["--node-ipc"];
  console.log(
    `launching python language server process with ${lsPath} ${lsArgs.join(
      "\n"
    )}`
  );
  const lsProcess = fork(lsPath, lsArgs);

  // choose a unique channel name, e.g. by using the PID
  const ipcChannel = "ls_" + lsProcess.pid;

  // create reader/writer for I/O streams
  const reader = new rpc.IPCMessageReader(lsProcess);
  const writer = new rpc.IPCMessageWriter(lsProcess);

  // forward everything from process's stdout to the mainWindow's renderer process
  reader.listen((msg) => {
    ipcMainManager.send("LSP_SEND", ipcChannel, msg);
  });
  // listen to incoming messages and forward them to the language server process

  ipcMainManager.on("LSP_ON", (event: any, pid: string, msg: Message) => {
    if (pid === ipcChannel) {
      writer.write(msg);
    }
  });
  function sendReadySignal() {
    ipcMainManager.send(
      "LSP_READY",
      {
        id: "python",
        extensions: [".py"],
        aliases: ["python", "py"],
      },
      ipcChannel
    );
  }
  if (monacoSettingApi.isMonacoReady) {
    sendReadySignal();
  }
  ipcMainManager.on("MONACO_READY", () => {
    sendReadySignal();
  });
}
function getPyrightPath() {
  if (app.isPackaged) {
    const resourcesPath =
      (process.platform === "darwin" &&
        path.join(
          app.getPath("exe"),
          "../../Resources/app.asar.unpacked/node_modules/pyright"
        )) ||
      path.join(
        app.getPath("exe"),
        "../Resources/app.asar.unpacked/node_modules/pyright"
      );
    return resourcesPath;
  } else {
    return path.join(__dirname, "../../node_modules/pyright");
  }
}
