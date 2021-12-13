import { useEffect, useState } from "react";
import { taskStatus } from "../../../../../src_main/editor/control";
import { ipcRendererManager } from "../../../../ipc";

export const useSelectTask = () => {
  const [taskList, setTaskList] = useState<taskStatus[]>([]);
  useEffect(() => {
    (async () => {
      const getlist = await ipcRendererManager.invoke(
        "GET_TASK_CONT_STATUS_ALL"
      );
      setTaskList(getlist);
    })();
  }, []);
  return {
    taskList,
  };
};
