import { taskControlApi, taskContStatusType } from "../../editor/control";
import { serviceMgtTaskInfo } from "../../file/taskinfo";
import { ipcMainManager } from "../../ipc/ipc";

class atcoderMgt {
  setupIPCMain() {
    ipcMainManager.on("CREATE_TASKCONT", (event, arg: taskContStatusType) => {
      if (arg.service === "atcoder") {
        this.openTaskCont(arg.taskGroup, arg.taskID);
      }
    });
  }
  openTaskCont(contestName: string, taskScreenName: string): void {
    const taskinfo: serviceMgtTaskInfo = {
      service: "atcoder",
      taskGroup: contestName,
      taskID: taskScreenName,
      taskURL: `https://atcoder.jp/contests/${contestName}/tasks/${taskScreenName}`,
    };
    taskControlApi.createNewTask(taskinfo);

    // return taskinfo;
  }
}

export const atcoderMgtApi = new atcoderMgt();
