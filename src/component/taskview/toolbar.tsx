import * as React from "react";
import Box from "@material-ui/core/Box";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import LanguageIcon from "@material-ui/icons/Language";
import "./toolbar.css";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      // display: "inline-block",
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
    <div
      style={{
        width: "100%",
        height: "28px",
        backgroundColor: "#282828",
      }}
      className="titlebar"
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box my="10px" mx="35px" style={{ backgroundColor: "grey" }}></Box>
        <Box className="no-drag" style={{ backgroundColor: "grey" }}>
          <IconButton onClick={async () => {}} size={"small"}>
            <HomeIcon />
          </IconButton>
        </Box>
        <Box className="no-drag" style={{ backgroundColor: "grey" }}>
          <IconButton onClick={() => {}} size={"small"}>
            <LanguageIcon />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
}
