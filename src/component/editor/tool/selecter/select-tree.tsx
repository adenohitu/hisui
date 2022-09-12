import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useSelectTask } from "./taskhook";
import { styled } from "@mui/material/styles";
import { Chip, Divider, ListSubheader, Stack, Typography } from "@mui/material";
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
      <ListItem dense>
        <ListItemText
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          Open Tasks
        </ListItemText>
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
                  selectTaskHooks.closeTaskCont(value.taskScreenName);
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
export function NowSelectTaskSelectList() {
  const selectTaskHooks = useSelectTask();

  return (
    <List
      sx={{
        paddingTop: "0",
        overflowX: "hidden",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        "&:hover": {
          overflow: "scroll",
          "&::-webkit-scrollbar": {
            width: "6px",
            height: 0,
          },
          "&::-webkit-scrollbar-track": {
            borderRadius: "3px",
            height: "100%",
            backgroundColor: " #eeeeee",
          },
          " &::-webkit-scrollbar-thumb": {
            borderRadius: "3px",
            backgroundColor: "#867670",
          },
        },
      }}
    >
      <ListSubheader
        sx={{ backgroundColor: "#a9c6de", paddingY: 1, paddingLeft: 0 }}
      >
        <Stack direction="row" spacing={1} justifyContent="flex-start">
          <IconButton
            onClick={() => {
              selectTaskHooks.updateTaskContList(false);
            }}
            edge="end"
            aria-label="delete"
            size="small"
          >
            <Refresh fontSize="inherit" />
          </IconButton>
          <Typography variant="body1">
            {selectTaskHooks.nowContestName}
          </Typography>
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
