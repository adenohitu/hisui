import { useEffect, useState } from "react";
import { editorStatus } from "../../../../../src_main/editor/taskcont";
import { ipcRendererManager } from "../../../../ipc";

export const useAppStatus = () => {
  const [contestName, setContestName] = useState<string>("");
  const [codeSize, setCodeSize] = useState<string>("0");
  useEffect(() => {
    ipcRendererManager.on("LISTENER_EDITOR_STATUS", (e, arg: editorStatus) => {
      setContestName(`${arg.contestName}/${arg.AssignmentName}`);
      setCodeSize(String(arg.taskcodeByte));
    });
  }, []);
  return { contestName, codeSize };
};
