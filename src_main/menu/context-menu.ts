import { Menu } from "electron";
import { ipcMainManager } from "../ipc/ipc";
import { IAction } from "./monaco-context";
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
  ipcMainManager.on("OPEN_CONTEXT_MENU", (e, custom?: MenuElement[]) => {
    if (custom) {
      createContextFromIAction(custom);
    } else {
      const contextMenu = Menu.buildFromTemplate(contextTemplate);
      contextMenu.popup();
    }
  });
};
export interface MenuElement {
  readonly id: string;
  label: string;
  tooltip: string;
  class: string | undefined;
  enabled: boolean;
  checked?: boolean;
  Keybinding?: string | null;
}
function createContextFromIAction(actions: MenuElement[]) {
  const contextTemplate: Electron.MenuItemConstructorOptions[] = actions.map(
    (element) => {
      return {
        label: element.label,
        checked: element.checked,
        enabled: element.enabled,
        accelerator: element.Keybinding || "",
        type: element.class as
          | "normal"
          | "separator"
          | "submenu"
          | "checkbox"
          | "radio",
        click: async () => {
          ipcMainManager.send("EDITOR_CONTEXT_ACTION", element.id);
        },
      };
    }
  );
  const contextMenu = Menu.buildFromTemplate(contextTemplate);
  contextMenu.popup();
}
