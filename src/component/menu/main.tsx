import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles, createStyles } from "@mui/styles";
import { Theme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import blueGrey from "@mui/material/colors/blueGrey";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CodeIcon from "@mui/icons-material/Code";
import HomeIcon from "@mui/icons-material/Home";
import LiveTv from "@mui/icons-material/LiveTv";
import ListItem from "@mui/material/ListItem";
// import SendIcon from "@mui/icons-material/Send";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ipcRendererManager } from "../../ipc";
import Window from "../dashboard/window";
import { Editor } from "../editor/main";
import FormDialog from "../auth/login_dialog";
import DefaltContest from "../setting/dafalt_contest";
import { StatusBar } from "../editor/tool/statusbar/status-bar";
import { Home } from "../home/Home";
import { TestCaseBoard } from "../case/main";

const drawerWidth = 240;
// let nowItem = 0;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      boxSizing: "border-box",
      paddingBottom: "22px",
      height: "100%",
    },
    toolbar: {
      paddingRight: 24,
    },
    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: "none",
    },
    title: {
      flexGrow: 1,
    },
    pageTitle: {
      marginBottom: theme.spacing(1),
    },
    drawerPaper: {
      background: "#424242",
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      position: "relative",
      zIndex: 0,
      flexGrow: 1,
      height: "100%",
      overflow: "auto",
      backgroundColor: "#666363",
    },
    container: {
      height: "100%",
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },
    viewName: {
      textDecoration: "none",
      color: theme.palette.text.secondary,
    },
    viewNameButton: { borderLeft: "10px" },
    iconEn: { color: blueGrey[50] },
    iconDi: { color: blueGrey[300] },
    itemText: { color: "white" },
  })
);

export const WindowRoot = () => {
  //react routor hooks
  const [location, setlocation] = useState("main");
  useEffect(() => {
    ipcRendererManager.on("LISTENER_VIEW_TOP", (e, viewName: string) => {
      setlocation(viewName);
    });
  }, []);
  const pageChange = (viewName: string) => {
    setlocation(viewName);
    ipcRendererManager.send("CHANGE_VIEW_TOP", viewName);
  };
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  // eslint-disable-next-line
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const menulist = [
    {
      id: 0,
      viewName: "main",
      text: "ホーム",
      icon: <HomeIcon />,
      component: <Home />,
    },
    {
      id: 1,
      viewName: "editor",
      text: "エディター",
      icon: <CodeIcon />,
      component: <Editor />,
    },
    {
      id: 3,
      viewName: "dashboard",
      text: "ダッシュボード",
      icon: <LiveTv />,
      component: <Window />,
    },

    {
      id: 4,
      viewName: "case",
      text: "テストケース",
      icon: <AssignmentTurnedInIcon />,
      component: <TestCaseBoard />,
    },
  ];

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <Divider />
        <List>
          {menulist.map((item) => (
            <Box
              borderLeft={3}
              borderColor={item.viewName === location ? "#eceff1" : "#424242"}
              className={classes.viewName}
              key={item.id}
            >
              <ListItem
                onClick={() => {
                  pageChange(item.viewName);
                }}
                button
              >
                <ListItemIcon
                  className={
                    item.viewName === location ? classes.iconEn : classes.iconDi
                  }
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  className={classes.itemText}
                  primary={item.text}
                />
              </ListItem>
            </Box>
          ))}
        </List>
      </Drawer>
      <FormDialog />
      <DefaltContest />
      <StatusBar />
      {menulist.map((element, index) => (
        <Box
          key={index}
          sx={{
            height: "100%",
            width: "100%",
            position: "absolute",
            zIndex: (location === element.viewName && 1) || -1,
            paddingBottom: "22px",
            paddingLeft: "56px",
          }}
        >
          <Box sx={{ height: "100%", overflow: "scroll" }}>
            {element.component}
          </Box>
        </Box>
      ))}
    </div>
  );
};
