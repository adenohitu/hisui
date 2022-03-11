import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useSelectTask } from "./taskhook";
import { styled } from "@mui/material/styles";
import { Divider } from "@mui/material";
import Refresh from "@mui/icons-material/Refresh";
import { ListSubheader } from "@mui/material";
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
        overflow: "auto",
        height: "100%",
        width: "100%",
      }}
    >
      <ListSubheader sx={{ backgroundColor: "#BFCFDC" }}>
        <ListItem
          secondaryAction={
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
          }
          dense
        >
          <ListItemText sx={{ overflow: "hidden", whiteSpace: "nowrap" }}>
            Tasks
          </ListItemText>
        </ListItem>
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
