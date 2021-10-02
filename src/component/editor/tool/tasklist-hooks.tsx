import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { taskList } from "../../../../src_main/data/scraping/tasklist";
import { loadtask } from "../../../app/Slice/editor";
import { ipcRendererManager } from "../../../ipc";

export const useTaskList = () => {
  const [taskList, setTasklist] = useState<taskList[]>([]);
  const [value, setValue] = useState<number | false>(false);
  const dispatch = useDispatch();
  const updateTasklist = async () => {
    const tasklist = await ipcRendererManager.invoke("GET_TASK_LIST");
    setTasklist(tasklist);
  };
  useEffect(() => {
    updateTasklist();
    // 更新イベントを受け取る
    ipcRendererManager.on("LISTENER_CHANGE_SET_CONTESTID", () => {
      updateTasklist();
    });
  }, []);

  const handleValueChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    setValue(newValue);
    console.log(taskList[newValue]);
    // taskContを作成
    // 存在する場合フォーカスする
    const data = taskList[newValue];
    console.log(newValue);
    dispatch(
      loadtask(data.contestName, data.taskScreenName, data.AssignmentName)
    );
  };

  return { taskList, value, setTasklist, updateTasklist, handleValueChange };
};
