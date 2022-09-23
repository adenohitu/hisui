import { useRecoilState } from "recoil";
import {
  contestNameState,
  taskScreenNameState,
  languageState,
  taskcodeByteState,
  submitLanguageState,
  AssignmentNameState,
} from "./status-atom";

export const useAppStatus = () => {
  const [contestName, setContestName] = useRecoilState(contestNameState);
  const [taskScreenName, setTaskScreenName] =
    useRecoilState(taskScreenNameState);
  const [assignmentName, setAssignmentName] =
    useRecoilState(AssignmentNameState);
  const [language, setLanguage] = useRecoilState(languageState);
  const [submitLanguagename, setSubmitLanguagename] =
    useRecoilState(submitLanguageState);
  const [codeSize, setCodeSize] = useRecoilState(taskcodeByteState);

  return {
    contestName,
    taskScreenName,
    assignmentName,
    language,
    codeSize,
    submitLanguagename,
    setCodeSize,
    setContestName,
    setLanguage,
    setAssignmentName,
    setSubmitLanguagename,
    setTaskScreenName,
  };
};
