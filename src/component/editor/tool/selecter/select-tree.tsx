import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useSelectTask } from "./taskhook";
import { styled } from "@mui/material/styles";
import {
  Chip,
  Divider,
  ListSubheader,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Refresh from "@mui/icons-material/Refresh";
const StyleListItem = styled(ListItem)<{ component?: React.ElementType }>({
  "& .MuiListItemSecondaryAction-root": {
    right: "0px",
  },
  // "& .MuiListItemButton-root": {
  //   right: "10px",
  // },
});
export function TaskSelectList() {
  const selectTaskHooks = useSelectTask();

  return (
    <List
      sx={{
        paddingTop: "0",
        overflowY: "auto",
        overflowX: "hidden",
        height: "100%",
        width: "100%",
        "&::-webkit-scrollbar": {
          width: "8px",
          backgroundColor: undefined,
        },
        "&::-webkit-scrollbar-track": {
          borderRadius: "5px",
        },
        "&::-webkit-scrollbar-thumb": {
          borderRadius: "10px",
          border: "2px auto",
          background: "gray",
        },
      }}
    >
      <ListItem dense sx={{ paddingX: "0px" }}>
        <Typography
          sx={{ whiteSpace: "nowrap", fontSize: "14px", paddingX: "10px" }}
        >
          Open Tasks
        </Typography>
        <Chip size="small" label={selectTaskHooks.taskList.length} />
      </ListItem>
      <Divider />
      {selectTaskHooks.taskList.map((value, index) => {
        return (
          <StyleListItem
            key={index}
            secondaryAction={
              <IconButton
                onClick={() => {
                  selectTaskHooks.closeTaskCont(value.margeid);
                }}
                size="small"
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton
              role={undefined}
              onClick={() => {
                selectTaskHooks.custonValueChange(index);
              }}
              dense
            >
              <ListItemText id={value.taskID} primary={value.taskID} />
            </ListItemButton>
          </StyleListItem>
        );
      })}
    </List>
  );
}
export function NowSelectTaskSelectList() {
  const selectTaskHooks = useSelectTask();

  return (
    <List
      sx={{
        paddingTop: "0",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        "&:hover": {
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            borderRadius: "5px",
          },
          " &::-webkit-scrollbar-thumb": {
            borderRadius: "10px",
            border: "2px auto",
            background: "gray",
          },
        },
      }}
    >
      <ListSubheader sx={{ backgroundColor: "#a9c6de", padding: 0 }}>
        <Stack padding="10px" justifyContent="center" spacing={0}>
          <Typography sx={{ overflow: "hidden", fontSize: "10px" }}>
            selected ContestID
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="flex-start">
            <ListItemText>{selectTaskHooks.nowContestName}</ListItemText>
            <Tooltip title="問題一覧を最新にする">
              <IconButton
                onClick={() => {
                  selectTaskHooks.updateTaskContList(false);
                }}
                edge="start"
                aria-label="delete"
                size="small"
              >
                <Refresh fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </ListSubheader>
      {selectTaskHooks.nowContestTaskList.map((value, index) => {
        return (
          <StyleListItem key={index} disablePadding>
            <ListItemButton
              role={undefined}
              onClick={() => {
                selectTaskHooks.custonValueChangeDefaltTask(index);
              }}
              dense
            >
              <ListItemText
                id={value.taskScreenName}
                primary={value.taskScreenName}
              />
            </ListItemButton>
          </StyleListItem>
        );
      })}
    </List>
  );
}
