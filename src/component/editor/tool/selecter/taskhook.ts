import { useEffect, useState } from "react";
import { taskNowStatus } from "../../../../../src_main/editor/control";
import { ipcRendererManager } from "../../../../ipc";

export const useSelectTask = () => {
  const [taskList, setTaskList] = useState<taskNowStatus[]>([]);
  const [value, setValue] = useState<number | false>(false);
  const updateTaskContList = async () => {
    const getlist = await ipcRendererManager.invoke("GET_TASK_CONT_STATUS_ALL");
    setTaskList(getlist);
    console.log("status", getlist);
  };
  useEffect(() => {
    updateTaskContList();
    ipcRendererManager.on("LISTENER_CONTEST_START", async (e, contestName) => {
      updateTaskContList();
    });
    ipcRendererManager.on("LISTENER_CHANGE_TASK_CONT_STATUS", (e) => {
      updateTaskContList();
    });
  }, []);

  const custonValueChange = (newValue: number) => {
    setValue(newValue);
    // taskContを作成
    // 存在する場合フォーカスする
    const data = taskList[newValue];
    console.log({
      contestName: data.contestName,
      taskScreenName: data.taskScreenName,
    });
    window.editor.createTaskCont({
      contestName: data.contestName,
      taskScreenName: data.taskScreenName,
    });
  };
  /**
   * 	TaskContを閉じる
   */
  const closeTaskCont = (taskScreenName: string) => {
    ipcRendererManager.send("CLOSE_TASKCONT", taskScreenName);
  };
  return {
    taskList,
    value,
    updateTaskContList,
    custonValueChange,
    closeTaskCont,
  };
};
