import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useSelectTask } from "./taskhook";
import { styled } from "@mui/material/styles";
const StyleListItem = styled(ListItem)<{ component?: React.ElementType }>({
  "& .MuiListItemSecondaryAction-root": {
    right: "0px",
  },
  "& .MuiListItemButton-root": {
    right: "10px",
  },
});
export function TaskSelectList() {
  const selectTaskHooks = useSelectTask();

  return (
    <List sx={{ width: "100%" }}>
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
          </StyleListItem>
        );
      })}
    </List>
  );
}
