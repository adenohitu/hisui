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
import { selecttaskData, sendGetTasklist } from "../../app/Slice/taskdata";

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#259B35",
    },
  },
})((props: StyledTabsProps) => (
  <Tabs
    {...props}
    orientation="vertical"
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
  root: {
    height: "100%",
    flexGrow: 1,
  },
  padding: {
    padding: theme.spacing(3),
  },
  demo2: {
    backgroundColor: "#eee",
    height: "100%",
  },
}));

export function TaskSelect() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();
  const taskData = useSelector(selecttaskData);
  useEffect(() => {
    dispatch(sendGetTasklist());
  }, [dispatch]);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo2}>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="styled tabs example"
        >
          {taskData.map((row: any) => (
            <StyledTab key={row.taskHeader} label={row.taskHeader} />
          ))}
        </StyledTabs>
        <Typography className={classes.padding} />
      </div>
    </div>
  );
}
