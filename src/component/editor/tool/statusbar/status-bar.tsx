import { makeStyles } from "@mui/styles";
import { ipcRendererManager } from "../../../../ipc";
import { handleClickOpenSelectLanguageDialog } from "../setting/languagedialog";
import { useAppStatus } from "./status-hooks";
export function StatusBar() {
  const appStatus = useAppStatus();
  return (
    <div
      style={{
        boxSizing: "border-box",
        position: "fixed",
        bottom: 0,
        height: "22px",
        width: "100%",
        backgroundColor: "#338a3e",
      }}
    >
      <StatusTextButton
        onClick={() => {
          ipcRendererManager.send("OPEN_SELECT_CONTEST_DIALOG");
        }}
      >
        {appStatus.contestName}
      </StatusTextButton>
      <StatusTextButton>{appStatus.taskname}</StatusTextButton>
      <StatusTextButton float="right">{`${appStatus.codeSize} Byte`}</StatusTextButton>
      <StatusTextButton onClick={() => {}} float="right">
        {appStatus.submitLanguagename}
      </StatusTextButton>
      <StatusTextButton
        onClick={() => {
          handleClickOpenSelectLanguageDialog();
        }}
        float="right"
      >
        {appStatus.language}
      </StatusTextButton>
    </div>
  );
}
const useStayles = makeStyles({
  buttonStyle: {
    height: "22px",
    padding: 0,
    border: "none",
    outline: "none",
    backgroundColor: "#338a3e",
    "&:hover": { backgroundColor: "#389644" },
    "&:active": { backgroundColor: "#3ba348" },
  },
  buttonText: {
    color: "#fff",
    margin: 0,
    marginLeft: 5,
    marginRight: 5,
    fontWeight: 300,
  },
});

interface StatusTextButtonProps {
  children: string;
  float?: "right" | "left";
  onClick?: () => void;
}
const StatusTextButton: React.FC<StatusTextButtonProps> = ({
  children,
  onClick,
  float = "left",
}) => {
  const classes = useStayles();
  return (
    <>
      <button
        onClick={onClick}
        style={{ float: float }}
        className={classes.buttonStyle}
      >
        <p className={classes.buttonText}>{children}</p>
      </button>
    </>
  );
};

interface StatusButtonProps {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StatusButton: React.FC<StatusButtonProps> = ({ children }) => {
  const classes = useStayles();
  return (
    <>
      <button className={classes.buttonStyle}>{children}</button>
    </>
  );
};
