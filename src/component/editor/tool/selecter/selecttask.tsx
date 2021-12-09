import React from "react";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";

import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useTaskList } from "../tasklist-hooks";

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
  },
}));

export function TaskSelect() {
  const classes = useStyles();
  const taskListHooks = useTaskList();

  return (
    <div className={classes.demo2}>
      <StyledTabs
        value={taskListHooks.value}
        onChange={taskListHooks.handleValueChange}
      >
        {taskListHooks.taskList.map((row: any) => (
          <StyledTab key={row.AssignmentName} label={row.AssignmentName} />
        ))}
      </StyledTabs>
    </div>
  );
}
