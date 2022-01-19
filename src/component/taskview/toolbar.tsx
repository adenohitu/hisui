import * as React from "react";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import UndoIcon from "@mui/icons-material/Undo";
import "./toolbar.css";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { ipcRendererManager } from "../../ipc";
export function TaskViewToolbar() {
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
        <Box my="28px" mx="35px"></Box>
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
        </Box>
      </Box>
    </div>
  );
}
