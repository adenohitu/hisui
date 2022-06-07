import * as React from "react";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import UndoIcon from "@mui/icons-material/Undo";
import "./toolbar.css";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { ipcRendererManager } from "../../ipc";
export function TaskViewToolbar() {
  const [platform, setplatform] = React.useState<string>("");
  const usememo = React.useMemo(() => {
    const data: DOMRect = (
      window.navigator as any
    ).windowControlsOverlay.getTitlebarAreaRect();
    console.log(data);
    return data;
  }, []);
  React.useEffect(() => {
    ipcRendererManager.invoke("GET_OS").then((platform) => {
      setplatform(platform);
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
        <Box className="no-drag">
          <IconButton
            sx={{ color: "#fff" }}
            onClick={async () => {
              ipcRendererManager.send("RUN_NOWTASKVIEW_RESET");
            }}
            size={"small"}
          >
            <UndoIcon />
          </IconButton>
          <IconButton
            sx={{ color: "#fff" }}
            onClick={async () => {
              ipcRendererManager.send("RUN_NOWTASKVIEW_RELOAD");
            }}
            size={"small"}
          >
            <RefreshIcon />
          </IconButton>
          <IconButton
            sx={{ color: "#fff" }}
            onClick={async () => {
              ipcRendererManager.send("LISTENER_CHANGE_TASKPAGE_VIEW");
            }}
            size={"small"}
          >
            <ListAltIcon />
          </IconButton>
          <IconButton
            sx={{ color: "#fff" }}
            onClick={async () => {
              ipcRendererManager.send("RUN_CHANGE_TASKVIEW", "atcoder-ploblem");
            }}
            size={"small"}
          >
            <ManageSearchIcon />
          </IconButton>
          <IconButton
            sx={{ color: "#fff" }}
            onClick={async () => {
              ipcRendererManager.send("LISTENER_CHANGE_LIBMANAGEMENT_VIEW");
            }}
            size={"small"}
          >
            <SettingsIcon />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
}
