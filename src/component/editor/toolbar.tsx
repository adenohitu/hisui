import React from "react";
import { Theme } from "@mui/material/styles";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { IconButton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import LanguageIcon from "@mui/icons-material/Language";
// import { monacoControlApi } from "./monacoapi";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      // height: "100%",
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
          // const data: any = await monacoControlApi.runOpenFile(
          //   "abc199",
          //   "A",
          //   "python"
          // );
          // monacoControlApi.setModel(data);
        }}
        size={"small"}
      >
        <SaveIcon />
      </IconButton>
      <IconButton onClick={() => {}} size={"small"}>
        <LanguageIcon />
      </IconButton>
    </div>
  );
}
