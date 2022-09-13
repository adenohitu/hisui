import { SnackbarKey } from "notistack";
import { ipcMainManager } from "../ipc/ipc";

export interface interactiveNotificationArgs {
  id: SnackbarKey;
  message: string;
  choices: {
    text: string;
    color?:
      | "inherit"
      | "secondary"
      | "primary"
      | "success"
      | "error"
      | "info"
      | "warning";
  }[];
}
export interface interactiveNotificationResult {
  id: SnackbarKey;
  choiceIndex: number;
}

class notificationManager {
  private callbackwait: Map<string | number, (choiceIndex: number) => void>;
  constructor() {
    this.callbackwait = new Map();
    this.setupResultHander();
  }
  private setupResultHander() {
    ipcMainManager.on(
      "ON_RESULT_INTERACTIVE_NOTIFICARION",
      (e, arg: interactiveNotificationResult) => {
        console.log(arg);

        if (this.callbackwait.has(arg.id)) {
          const runCallback = this.callbackwait.get(arg.id);
          if (runCallback) {
            runCallback(arg.choiceIndex);
          }
          this.callbackwait.delete(arg.id);
        }
      }
    );
  }
  /**
   * @param id
   * 固有のID
   * @param message
   * 表示するメッセージ
   * @param choices
   * 選択肢
   * @param choicesCallback
   * Callbackは実行されない場合があり実行を保証されない
   */
  runInteractiveNotification(
    interactiveNotificationIn: interactiveNotificationArgs,
    choicesCallback: (choiceIndex: number) => void
  ) {
    ipcMainManager.send(
      "SEND_OPEN_INTERACTIVE_NOTIFICARION",
      interactiveNotificationIn
    );
    this.callbackwait.set(interactiveNotificationIn.id, choicesCallback);
  }
}
export const notificationManagerApi = new notificationManager();
