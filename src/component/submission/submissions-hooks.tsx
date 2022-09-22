import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { submissionData } from "../../../src_main/data/submissions-type";
import { ipcRendererManager } from "../../ipc";
export interface submissionDataMarge extends submissionData {
  createDateRender: string;
}
export const useSubmisisons = () => {
  const [rows, setrows] = useState<submissionDataMarge[]>([]);

  useEffect(() => {
    ipcRendererManager.on(
      "LISTENER_RETUEN_SUBMISSIONS",
      (event, arg: submissionData[]) => {
        setrows(
          arg.slice().map((ele) => {
            return {
              createDateRender: dayjs(ele.created).format("YY/MM/DD HH:mm:ss"),
              ...ele,
            };
          })
        );
      }
    );
  }, []);
  // //初回だけ実行
  useEffect(() => {
    //ipc送信関数
    ipcRendererManager.send("RUN_UPDATE_SUBMISSIONS");
  }, []);

  return {
    rows,
    setrows,
  };
};
