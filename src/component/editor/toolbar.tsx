import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import LanguageIcon from "@material-ui/icons/Language";
import { monacoControlApi } from "./monacoapi";
// import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from "@material-ui/icons/Menu";

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

export function EditorToolbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <IconButton
        onClick={async () => {
          const data: any = await monacoControlApi.runOpenFile(
            "abc199",
            "A",
            "python"
          );

          monacoControlApi.setModel(data);
        }}
        size={"small"}
      >
        <SaveIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          monacoControlApi.runtest();
        }}
        size={"small"}
      >
        <LanguageIcon />
      </IconButton>
    </div>
  );
}
