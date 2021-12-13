import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { SvgIconProps } from "@mui/material/SvgIcon";
// import AssignmentIcon from "@mui/icons-material/Assignment";
// import { Chip, chipClasses } from "@mui/material";
import { useTaskList } from "../tasklist-hooks";

declare module "react" {
  interface CSSProperties {
    "--tree-view-color"?: string;
    "--tree-view-bg-color"?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon?: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    padding: "0 4px",
    ".MuiTreeItem-iconContainer": {
      width: "0",
      marginRight: 0,
    },
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: "var(--tree-view-color)",
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));
// const StyledChip = styled(Chip)(({ theme }) => ({
//   [`.${chipClasses.label}`]: {
//     paddingLeft: "6px",
//     paddingRight: "6px",
//   },
// }));
function StyledTreeItem(props: StyledTreeItemProps) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ alignItems: "center", p: 0.5, pr: 0 }}>
          {/* <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} /> */}
          {/* <StyledChip
            sx={{
              mr: 1,
              bgcolor: "green",
              color: "white",
              height: "15px",
              fontSize: "13px",
              paddingTop: "2px",
              borderRadius: "4px",
            }}
            size="small"
            label="AC"
          /> */}
          <Typography
            variant="body2"
            sx={{ fontWeight: "inherit", flexGrow: 1 }}
          >
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
      }}
      {...other}
    />
  );
}

export function TaskSelectTree() {
  const taskListHooks = useTaskList();

  return (
    <TreeView
      aria-label="gmail"
      defaultExpanded={["3"]}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      sx={{ height: "100%", flexGrow: 1, width: "100%" }}
    >
      {taskListHooks.taskList.map((row, index) => (
        <StyledTreeItem
          key={index}
          nodeId={row.taskScreenName}
          labelText={`${row.AssignmentName}-${row.contestName}`}
          // labelInfo={row.taskName}
          onClick={() => {
            taskListHooks.custonValueChange(index);
          }}
        />
      ))}
    </TreeView>
  );
}
