import React, { useState } from "react";

import clsx from "clsx";
import { createMuiTheme } from "@material-ui/core/styles";
// import * as colors from "@material-ui/core/colors";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
// import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
// import Container from "@material-ui/core/Container";
import { useHistory, useLocation } from "react-router-dom";
// import IconButton from "@material-ui/core/IconButton";
// import AccessTime from "@material-ui/icons/AccessTime";
import blueGrey from "@material-ui/core/colors/blueGrey";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn"; // eslint-disable-next-line
import CodeIcon from "@material-ui/icons/Code";
import HomeIcon from "@material-ui/icons/Home";
// import MenuIcon from "@material-ui/icons/Menu";
// import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import LiveTv from "@material-ui/icons/LiveTv";
import ListItem from "@material-ui/core/ListItem";
import SendIcon from "@material-ui/icons/Send";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText"; // eslint-disable-next-line
import SettingsIcon from "@material-ui/icons/Settings";
const drawerWidth = 240;
// let nowItem = 0;
const theme = createMuiTheme({});

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
    link: {
      textDecoration: "none",
      color: theme.palette.text.secondary,
    },
    linkButton: { borderLeft: "10px" },
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
  const history = useHistory();
  const location = useLocation();

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
      link: "/",
      text: "ホーム",
      icon: <HomeIcon />,
    },
    { id: 1, link: "/editor", text: "エディター", icon: <CodeIcon /> },
    { id: 2, link: "/submit", text: "提出", icon: <SendIcon /> },
    {
      id: 3,
      link: "/dashboard",
      text: "ダッシュボード",
      icon: <LiveTv />,
    },

    {
      id: 4,
      link: "/case",
      text: "テストケース",
      icon: <AssignmentTurnedInIcon />,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
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
                borderColor={
                  item.link === location.pathname ? "#eceff1" : "#424242"
                }
                className={classes.link}
                key={item.id}
              >
                <ListItem
                  onClick={() => {
                    history.push(item.link);
                  }}
                  button
                >
                  <ListItemIcon
                    className={
                      item.link === location.pathname
                        ? classes.iconEn
                        : classes.iconDi
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
              className={classes.link}
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
    </ThemeProvider>
  );
};
