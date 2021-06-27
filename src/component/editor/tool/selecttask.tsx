import React, { useEffect } from "react";
import {
  makeStyles,
  withStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import { selecttaskData, sendGetTasklist } from "../../../app/Slice/taskdata";
import { loadtask } from "../../../app/Slice/editor";

interface StyledTabsProps {
  value: number | false;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      height: "100%",

      maxWidth: 40,
      width: "100%",
      backgroundColor: "#259B35",
    },
  },
})((props: any) => (
  <Tabs
    {...props}
    style={{ height: "100%" }}
    orientation="vertical"
    variant="scrollable"
    scrollButtons="auto"
    TabIndicatorProps={{
      children: <span />,
      style: {
        width: "6px",
      },
    }}
  />
));

interface StyledTabProps {
  label: string;
}

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      alignItems: "flex-start",
    },
    root: {
      textTransform: "none",
      color: "#000",
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
      "&:focus": {
        opacity: 1,
      },
    },
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme: Theme) => ({
  padding: {},
  demo2: {
    backgroundColor: "#eee",
    height: "100%",
  },
}));

export function TaskSelect() {
  const classes = useStyles();
  const [value, setValue] = React.useState<number | false>(false);
  const dispatch = useDispatch();
  const taskData = useSelector(selecttaskData);
  useEffect(() => {
    dispatch(sendGetTasklist());
  }, [dispatch]);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    const loadrun = async () => {
      const contestName = await window.api.get_SetContestID_render();
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
      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label="styled tabs example"
      >
        {taskData.map((row: any) => (
          <StyledTab key={row.AssignmentName} label={row.AssignmentName} />
        ))}
      </StyledTabs>
      <Typography className={classes.padding} />
    </div>
  );
}
