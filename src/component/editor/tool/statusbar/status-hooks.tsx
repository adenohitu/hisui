import { useRecoilState } from "recoil";
import {
  contestNameState,
  TaskScreenNameState,
  languageState,
  taskcodeByteState,
  submitLanguageState,
  AssignmentNameState,
} from "../../../../recoil/atom";

export const useAppStatus = () => {
  const [contestName, setContestName] = useRecoilState(contestNameState);
  const [taskname, setTaskname] = useRecoilState(TaskScreenNameState);
  const [assignmentName, setAssignmentName] =
    useRecoilState(AssignmentNameState);
  const [language, setLanguage] = useRecoilState(languageState);
  const [submitLanguagename, setSubmitLanguagename] =
    useRecoilState(submitLanguageState);
  const [codeSize, setCodeSize] = useRecoilState(taskcodeByteState);

  return {
    contestName,
    taskname,
    assignmentName,
    language,
    codeSize,
    submitLanguagename,
    setCodeSize,
    setContestName,
    setLanguage,
    setAssignmentName,
    setSubmitLanguagename,
    setTaskname,
  };
};
