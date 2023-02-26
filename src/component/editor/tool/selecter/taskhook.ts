import { useEffect, useState } from "react";
import { taskList } from "../../../../../src_main/data/scraping/tasklist";
import {
  taskContStatusType,
  taskNowStatus,
} from "../../../../../src_main/editor/control";
import { ipcRendererManager } from "../../../../ipc";

export const useSelectTask = () => {
  const [taskList, setTaskList] = useState<taskNowStatus[]>([]);
  const [value, setValue] = useState<number | false>(false);
  const [nowContestTaskList, setNowContestTaskList] = useState<taskList[]>([]);
  const [nowContestName, setNowContestName] = useState<string>("");

  const updateNowContestName = async () => {
    const nowName = await ipcRendererManager.invoke("GET_SET_CONTESTID");
    setNowContestName(nowName);
  };
  const updateTaskContList = async (cache: boolean = true) => {
    // TaskContのListを取得
    const getlist: taskNowStatus[] = await ipcRendererManager.invoke(
      "GET_TASK_CONT_STATUS_ALL"
    );
    setTaskList(getlist);
    // 現在のコンテストのListを取得
    const data: taskList[] = await ipcRendererManager.invoke(
      "GET_TASK_LIST",
      cache
    );
    setNowContestTaskList(data);
  };
  useEffect(() => {
    updateNowContestName();
    updateTaskContList();
    ipcRendererManager.on("LISTENER_CHANGE_SET_CONTESTID", () => {
      updateTaskContList();
      updateNowContestName();
    });
    ipcRendererManager.on("LISTENER_CONTEST_START", async (e, contestName) => {
      updateTaskContList();
    });
    ipcRendererManager.on("LISTENER_CHANGE_TASK_CONT_STATUS", (e) => {
      updateTaskContList();
    });
  }, []);

  const custonValueChangeDefaltTask = (newValue: number) => {
    // taskContを作成
    // 存在する場合フォーカスする
    const data = nowContestTaskList[newValue];
    const createTaskcontArg: taskContStatusType = {
      service: "atcoder",
      taskGroup: data.contestName,
      taskID: data.taskScreenName,
    };
    ipcRendererManager.send("CREATE_TASKCONT", createTaskcontArg);
  };

  const custonValueChange = (newValue: number) => {
    setValue(newValue);
    // taskContを作成
    // 存在する場合フォーカスする
    const data = taskList[newValue];
    const createTaskcontArg: taskContStatusType = {
      service: "atcoder",
      taskGroup: data.taskGroup,
      taskID: data.taskID,
    };
    console.log(createTaskcontArg);

    ipcRendererManager.send("CREATE_TASKCONT", createTaskcontArg);
  };
  /**
   * 	TaskContを閉じる
   */
  const closeTaskCont = (taskScreenName: string) => {
    ipcRendererManager.send("CLOSE_TASKCONT", taskScreenName);
  };
  return {
    taskList,
    nowContestTaskList,
    nowContestName,
    value,
    updateTaskContList,
    custonValueChange,
    custonValueChangeDefaltTask,
    closeTaskCont,
  };
};
