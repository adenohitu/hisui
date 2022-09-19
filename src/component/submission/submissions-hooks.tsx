import { useEffect, useState } from "react";
import { submissionData } from "../../../src_main/data/submissions-type";
import { ipcRendererManager } from "../../ipc";

export const useSubmisisons = () => {
  const [rows, setrows] = useState<submissionData[]>([]);
  const [selectedData, setDelectedData] = useState<submissionData[]>([]);
  const [selectedContestName, setSelectedContestName] = useState<string | null>(
    null
  );

  useEffect(() => {
    const filterContestName = (contestName: string) => {
      return rows.filter((ele) => ele.contestName === contestName);
    };
    if (selectedContestName !== null) {
      setDelectedData(filterContestName(selectedContestName));
    } else {
      setDelectedData(rows);
    }
  }, [rows, selectedContestName]);

  useEffect(() => {
    ipcRendererManager.on("LISTENER_RETUEN_SUBMISSIONS", (event, arg) => {
      // 一時的に200件に制限
      setrows(arg.slice(0, 200));
    });
  }, []);
  // //初回だけ実行
  useEffect(() => {
    //ipc送信関数
    ipcRendererManager.send("RUN_UPDATE_SUBMISSIONS");
  }, []);

  return {
    rows,
    setrows,
    selectedData,
    setDelectedData,
    selectedContestName,
    setSelectedContestName,
  };
};
