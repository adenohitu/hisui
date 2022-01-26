import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useSelectTask } from "./taskhook";

export function TaskSelectList() {
  const selectTaskHooks = useSelectTask();

  return (
    <List sx={{ width: "100%" }}>
      {selectTaskHooks.taskList.map((value, index) => {
        return (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton
                onClick={() => {
                  selectTaskHooks.closeTaskCont(value.taskScreenName);
                }}
                size="small"
              >
                <CloseIcon />
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
          </ListItem>
        );
      })}
    </List>
  );
}
