import { prepare, installLatest } from "@clangd/install";
import { app } from "electron";
import { mkdir, writeFile } from "fs/promises";
import { join, basename } from "path";
import { languageServers } from "./pyright";
import { stdcTemp } from "./stdc";
import * as rpc from "vscode-ws-jsonrpc";
import { Message } from "vscode-jsonrpc";
import { spawn } from "child_process";
import { ipcMainManager } from "../../ipc/ipc";
import { monacoSettingApi } from "../monaco";

class clangdUI {
  clangdPath: string;
  constructor(public readonly storagePath: string) {
    console.log("Storage is", this.storagePath);
    this.clangdPath = storagePath;
  }
  private event(s: string) {
    // console.log(s);
  }
  info(s: string) {
    this.event("info");
    console.log(s);
  }
  error(s: string) {
    this.event("error");
    console.error(s);
  }
  showHelp(msg: string, url: string) {
    this.event("showHelp");
    console.info(msg, url);
  }

  promptReload() {
    this.event("promptReload");
  }
  promptUpdate() {
    this.event("promptUpdate");
  }
  promptInstall() {
    this.event("promptInstall");
  }
  public shouldReuseValue = true;
  async shouldReuse() {
    this.event("shouldReuse");
    return this.shouldReuseValue;
  }

  slow<T>(_title: string, work: Promise<T>) {
    this.event("slow");
    return work;
  }
  progress<T>(
    _title: string,
    _cancel: any,
    work: (progress: (fraction: number) => void) => Promise<T>
  ) {
    this.event("progress");
    return work((fraction) => console.log("progress% ", 100 * fraction));
  }
}
const storagePath = join(
  app.getPath("userData"),
  "setting",
  "extensions",
  "clangd"
);
async function copyStdc(clangdPath: string | null) {
  if (clangdPath) {
    const versionName = basename(join(clangdPath, "../../../"));
    const stdcSavepath = join(
      clangdPath,
      "../../lib/clang",
      versionName,
      "include",
      "bits"
    );
    await mkdir(stdcSavepath, { recursive: true });
    const stdcSaveFileName = join(stdcSavepath, "stdc++.h");
    await writeFile(stdcSaveFileName, stdcTemp, "utf-8");
  }
}

export const ui = new clangdUI(storagePath);
export async function setupClangd(): Promise<languageServers> {
  const result = await prepare(ui, true);
  if (result.clangdPath === null) {
    await installLatest(ui);
    const installedpath = await prepare(ui, false);
    await copyStdc(installedpath.clangdPath);
    if (installedpath.clangdPath) {
      return {
        cpp: { command: [installedpath.clangdPath, "--pretty"] },
      };
    } else {
      return {};
    }
  } else {
    const installedpath = await prepare(ui, false);
    if (installedpath.clangdPath) {
      return {
        cpp: { command: [installedpath.clangdPath, "--pretty"] },
      };
    } else {
      return {};
    }
  }
}
export async function setupLSP_Clangd() {
  const getClangdInfo = await setupClangd();
  const setArgs = [getClangdInfo["cpp"].command[1]];
  const lsProcess = spawn(getClangdInfo["cpp"].command[0], setArgs);

  // choose a unique channel name, e.g. by using the PID
  const ipcChannel = "ls_" + lsProcess.pid;

  // create reader/writer for I/O streams
  const reader = new rpc.StreamMessageReader(lsProcess.stdout);
  const writer = new rpc.StreamMessageWriter(lsProcess.stdin);

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
        id: "cpp",
        extensions: [".cpp"],
        aliases: ["C++", "cpp"],
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
