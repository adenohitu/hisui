import React, { useEffect } from "react";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { useDispatch, useSelector } from "react-redux";
import {
  changeNowtop,
  selectNowtop,
  selecttaskData,
  sendGetTasklist,
} from "../../../app/Slice/taskdata";
import { loadtask } from "../../../app/Slice/editor";
import { ipcRendererManager } from "../../../ipc";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number | false;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    style={{ height: "100%" }}
    orientation="vertical"
    variant="scrollable"
    scrollButtons="auto"
    TabIndicatorProps={{
      children: (
        <span className="MuiTabs-indicatorSpan" style={{ width: "6px" }} />
      ),
      style: {
        width: "6px",
      },
    }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "#635ee7",
  },
});

interface StyledTabProps {
  label: string;
}

export const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: "#000",
  "&.Mui-selected": {
    color: "#000",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
  alignItems: "flex-start",
}));

const useStyles = makeStyles((theme: Theme) => ({
  demo2: {
    backgroundColor: "#eee",
    height: "100%",
  },
}));

export function TaskSelect() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const value = useSelector(selectNowtop);
  const taskData = useSelector(selecttaskData);
  useEffect(() => {
    dispatch(sendGetTasklist());
    // 更新イベントを受け取る
    ipcRendererManager.on("LISTENER_CHANGE_SET_CONTESTID", () => {
      dispatch(sendGetTasklist());
      console.log("change_set_contestID");
      // 選択を初期化
      dispatch(changeNowtop(false));
    });
  }, [dispatch]);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    dispatch(changeNowtop(newValue));
    const loadrun = async () => {
      const contestName = await ipcRendererManager.invoke("GET_SET_CONTESTID");
      dispatch(
        loadtask(
          contestName,
          taskData[newValue].taskScreenName,
          taskData[newValue].AssignmentName
        )
      );
    };
    loadrun();
  };

  return (
    <div className={classes.demo2}>
      <StyledTabs value={value} onChange={handleChange}>
        {taskData.map((row: any) => (
          <StyledTab key={row.AssignmentName} label={row.AssignmentName} />
        ))}
      </StyledTabs>
    </div>
  );
}
