import * as React from "react";
import Box from "@mui/material/Box";
import { Button, IconButton, Stack, SxProps } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import UndoIcon from "@mui/icons-material/Undo";
import "./toolbar.css";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { ipcRendererManager } from "../../ipc";
import AssignmentIcon from "@mui/icons-material/Assignment";
export function TaskViewToolbar() {
  const [platform, setplatform] = React.useState<string>("");
  const [nowTopTaskScreenName, setnowTopTaskScreenName] = React.useState<
    string | null
  >(null);
  const usememo = React.useMemo(() => {
    const data: DOMRect = (
      window.navigator as any
    ).windowControlsOverlay.getTitlebarAreaRect();
    console.log(data);
    return data;
  }, []);
  const buttonStyle: SxProps = {
    height: usememo.height,
    width: "120px",
    minWidth: 0,
    borderRadius: "0px",
    paddingY: 0,
    border: 0,
  };
  const iconButtonStyle: SxProps = {
    color: "#fff",
    paddingY: 0,
    height: usememo.height,
  };

  React.useEffect(() => {
    ipcRendererManager.invoke("GET_OS").then((platform) => {
      setplatform(platform);
    });
    ipcRendererManager.on("LISTENER_NOW_PRIMARY_VIEW", (e, ViewID) => {
      console.log(ViewID);
      setnowTopTaskScreenName(ViewID);
    });
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: usememo.height,
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
        {platform === "darwin" && (
          <Box my={usememo.height} ml={`${usememo.x}px`}></Box>
        )}
        <Box sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              overflow: "hidden",
              width: buttonWidth(nowTopTaskScreenName),
              transform: buttonTranslate(nowTopTaskScreenName),
              transition: "all 300ms 100ms ease",
            }}
            className="no-drag"
          >
            <Stack direction="row">
              <Button
                sx={buttonStyle}
                variant="outlined"
                onClick={() => {
                  ipcRendererManager.send("RUN_CHANGE_PRIMARY_VIEW");
                }}
                disableFocusRipple={true}
              >
                <AssignmentIcon />
                {nowTopTaskScreenName}
              </Button>
              <IconButton
                sx={iconButtonStyle}
                onClick={async () => {
                  ipcRendererManager.send("RUN_NOWTASKVIEW_RESET");
                }}
                size={"small"}
              >
                <UndoIcon />
              </IconButton>
              <IconButton
                sx={iconButtonStyle}
                onClick={async () => {
                  ipcRendererManager.send("RUN_NOWTASKVIEW_RELOAD");
                }}
                size={"small"}
              >
                <RefreshIcon />
              </IconButton>
              <IconButton
                sx={iconButtonStyle}
                onClick={async () => {
                  ipcRendererManager.send("LISTENER_CHANGE_TASKPAGE_VIEW");
                }}
                size={"small"}
              >
                <ListAltIcon />
              </IconButton>
              <IconButton
                sx={iconButtonStyle}
                onClick={async () => {
                  ipcRendererManager.send(
                    "RUN_CHANGE_TASKVIEW",
                    "atcoder-ploblem"
                  );
                }}
                size={"small"}
              >
                <ManageSearchIcon />
              </IconButton>
              <IconButton
                sx={iconButtonStyle}
                onClick={async () => {
                  ipcRendererManager.send("LISTENER_CHANGE_LIBMANAGEMENT_VIEW");
                }}
                size={"small"}
              >
                <SettingsIcon />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
function buttonTranslate(nowTopTaskScreenName: string | null) {
  if (nowTopTaskScreenName === "" || nowTopTaskScreenName == null) {
    return "translateX(-120px)";
  } else {
    return "translateX(0px)";
  }
}
function buttonWidth(nowTopTaskScreenName: string | null) {
  if (nowTopTaskScreenName === "" || nowTopTaskScreenName == null) {
    return "500px";
  } else {
    return "500px";
  }
}
