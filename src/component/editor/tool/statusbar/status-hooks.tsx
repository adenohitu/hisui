import { useEffect, useState } from "react";
import { editorStatus } from "../../../../../src_main/editor/taskcont";
import { ipcRendererManager } from "../../../../ipc";

export const useAppStatus = () => {
  const [contestName, setContestName] = useState<string>("");
  const [taskname, setTaskname] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [codeSize, setCodeSize] = useState<string>("-");
  useEffect(() => {
    ipcRendererManager.on("LISTENER_EDITOR_STATUS", (e, arg: editorStatus) => {
      setContestName(arg.contestName);
      setTaskname(arg.AssignmentName);
      setLanguage(arg.language);
      setCodeSize(String(arg.taskcodeByte));
    });
  }, []);
  return { contestName, taskname, language, codeSize };
};
