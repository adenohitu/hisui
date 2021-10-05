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
const drawerWidth = 240;
// let nowItem = 0;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
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
      flexGrow: 1,
      height: "100vh",
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

// export function getnow() {
//   return windowValue;
// }
export interface GenericTemplateProps {
  children: React.ReactNode;
}
export const Menu: React.FC<GenericTemplateProps> = ({ children }) => {
  //react routor hooks
  const [location, setlocation] = useState("main");
  useEffect(() => {
    ipcRendererManager.on("LISTENER_VIEW_TOP", (e, viewName: string) => {
      setlocation(viewName);
    });
  });
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

  var menulist = [
    {
      id: 0,
      viewName: "main",
      text: "ホーム",
      icon: <HomeIcon />,
    },
    { id: 1, viewName: "editor", text: "エディター", icon: <CodeIcon /> },
    // { id: 2, viewName: "submit", text: "提出", icon: <SendIcon /> },
    {
      id: 3,
      viewName: "dashboard",
      text: "ダッシュボード",
      icon: <LiveTv />,
    },

    {
      id: 4,
      viewName: "case",
      text: "テストケース",
      icon: <AssignmentTurnedInIcon />,
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
          {/* <Box
              borderLeft={3}
              borderColor={"#424242"}
              className={classes.viewName}
            >
              <ListItem button>
                <ListItemIcon className={classes.iconDi}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText
                  className={classes.itemText}
                  primary={"setting"}
                />
              </ListItem>
            </Box> */}
        </List>
      </Drawer>
      <main className={classes.content}>{children}</main>
    </div>
  );
};
