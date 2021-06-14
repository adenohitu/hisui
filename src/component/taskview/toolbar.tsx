import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import HomeIcon from "@material-ui/icons/Home";
import LanguageIcon from "@material-ui/icons/Language";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    bar: {
      backgroundColor: "#545454",
    },
  })
);

export function TaskViewToolbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <IconButton onClick={async () => {}} size={"small"}>
        <HomeIcon />
      </IconButton>
      <IconButton onClick={() => {}} size={"small"}>
        <LanguageIcon />
      </IconButton>
    </div>
  );
}
