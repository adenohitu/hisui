import { useEffect, useState } from "react";
import { editorStatus } from "../../../../../src_main/editor/taskcont";
import { ipcRendererManager } from "../../../../ipc";

export const useAppStatus = () => {
  const [contestName, setContestName] = useState<string>("");
  const [taskname, setTaskname] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [codeSize, setCodeSize] = useState<string>("-");
  const [submitLanguagename, setSubmitLanguagename] = useState<string>("");
  useEffect(() => {
    ipcRendererManager.on("LISTENER_EDITOR_STATUS", (e, arg: editorStatus) => {
      setContestName(arg.contestName);
      setTaskname(String(arg.AssignmentName));
      setLanguage(arg.language);
      setCodeSize(String(arg.taskcodeByte));
      setSubmitLanguagename(
        (arg.submitLanguage?.Languagename &&
          arg.submitLanguage?.Languagename) ||
          ""
      );
    });
  }, []);
  return { contestName, taskname, language, codeSize, submitLanguagename };
};
