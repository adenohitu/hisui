import { makeStyles } from "@mui/styles";
import { useAppStatus } from "./status-hooks";

export function StatusBar() {
  const appStatus = useAppStatus();
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        height: 22,
        width: "100%",
        backgroundColor: "#338a3e",
      }}
    >
      <StatusTextButton>{appStatus.contestName}</StatusTextButton>
      <StatusTextButton float="right">{`${appStatus.codeSize} Byte`}</StatusTextButton>
    </div>
  );
}
const useStayles = makeStyles({
  buttonStyle: {
    height: 22,
    padding: 0,
    border: "none",
    outline: "none",
    backgroundColor: "#338a3e",
    "&:hover": { backgroundColor: "#389644" },
    "&:active": { backgroundColor: "#3ba348" },
  },
  buttonText: {
    color: "#fff",
    marginLeft: 5,
    marginRight: 5,
    fontWeight: 300,
  },
});

interface StatusTextButtonProps {
  children: string;
  float?: "right" | "left";
}
const StatusTextButton: React.FC<StatusTextButtonProps> = ({
  children,
  float = "left",
}) => {
  const classes = useStayles();
  return (
    <>
      <button style={{ float: float }} className={classes.buttonStyle}>
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
