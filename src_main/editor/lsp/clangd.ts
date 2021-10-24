import { prepare, installLatest } from "@clangd/install";
import { app } from "electron";
import { mkdir, writeFile } from "fs/promises";
import { join, basename } from "path";
import { languageServers } from "./lsp-server";
import { stdcTemp } from "./stdc";

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
