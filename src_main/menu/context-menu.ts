import { Menu } from "electron";
import { ipcMainManager } from "../ipc/ipc";
const isMac = process.platform === "darwin";
/**
 * 右クリックメニューのセットアップ
 */
export const setupContextMenu = () => {
  const contextTemplate: any = [
    { role: "undo" },
    { role: "redo" },
    { type: "separator" },
    { role: "cut" },
    { role: "copy" },
    { role: "paste" },
    ...(isMac
      ? [
          { role: "pasteAndMatchStyle" },
          { role: "delete" },
          { role: "selectAll" },
          { type: "separator" },
          {
            label: "Speech",
            submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
          },
        ]
      : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
  ];
  const contextMenu = Menu.buildFromTemplate(contextTemplate);
  ipcMainManager.on("OPEN_CONTEXT_MENU", () => {
    contextMenu.popup();
  });
};
