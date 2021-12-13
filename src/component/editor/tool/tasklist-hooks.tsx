import { useEffect, useState } from "react";
import { taskList } from "../../../../src_main/data/scraping/tasklist";
import { ipcRendererManager } from "../../../ipc";

export const useTaskList = () => {
  const [taskList, setTasklist] = useState<taskList[]>([]);
  const [value, setValue] = useState<number | false>(false);
  const updateTasklist = async () => {
    const tasklist = await ipcRendererManager.invoke("GET_TASK_LIST");
    setTasklist(tasklist);
  };
  useEffect(() => {
    updateTasklist();
    // 更新イベントを受け取る
    ipcRendererManager.on("LISTENER_CHANGE_SET_CONTESTID", () => {
      updateTasklist();
      // 選択していたContestをfalseに初期化
      setValue(false);
    });
  }, []);

  const handleValueChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    setValue(newValue);
    // taskContを作成
    // 存在する場合フォーカスする
    const data = taskList[newValue];
    console.log({
      contestName: data.contestName,
      TaskScreenName: data.taskScreenName,
      AssignmentName: data.AssignmentName,
    });
    window.editor.createTaskCont({
      contestName: data.contestName,
      TaskScreenName: data.taskScreenName,
      AssignmentName: data.AssignmentName,
    });
  };
  const custonValueChange = (newValue: number) => {
    setValue(newValue);
    // taskContを作成
    // 存在する場合フォーカスする
    const data = taskList[newValue];
    console.log({
      contestName: data.contestName,
      TaskScreenName: data.taskScreenName,
      AssignmentName: data.AssignmentName,
    });
    window.editor.createTaskCont({
      contestName: data.contestName,
      TaskScreenName: data.taskScreenName,
      AssignmentName: data.AssignmentName,
    });
  };

  return {
    taskList,
    value,
    setTasklist,
    updateTasklist,
    handleValueChange,
    custonValueChange,
  };
};
