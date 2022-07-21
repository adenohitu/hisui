import { store } from "../save/save";

export function dockerExePath() {
  return store.get("dockerPath", "docker");
}
export function replaceCommanddockerExePath(command: string | null) {
  if (command) {
    const dockerpath = store.get("dockerPath", "docker");
    const repolacedCommand = command.replace("{dockerPath}", dockerpath);
    return repolacedCommand;
  } else {
    return null;
  }
}
// Storeの初期値を設定
export async function setupStoreDockerDefaultValue() {
  // issue #274
  if (!store.has("dockerPath")) {
    if (process.platform === "darwin") {
      store.set("dockerPath", "/usr/local/bin/docker");
    } else {
      store.set("dockerPath", "docker");
    }
  }
}
