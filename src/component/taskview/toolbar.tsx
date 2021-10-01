import * as React from "react";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import "./toolbar.css";
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
            style={{ color: "#fff" }}
            onClick={async () => {
              window.taskview.nowTaskViewReset();
            }}
            size={"small"}
          >
            <UndoIcon />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
}
