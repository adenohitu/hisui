import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { SvgIconProps } from "@mui/material/SvgIcon";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Chip } from "@mui/material";

declare module "react" {
  interface CSSProperties {
    "--tree-view-color"?: string;
    "--tree-view-bg-color"?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
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
        <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
          {/* <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} /> */}
          <Chip
            sx={{
              mr: 1,
              bgcolor: "green",
              color: "white",
              height: "15px",
              fontSize: "13px",
              paddingTop: "2px",
            }}
            size="small"
            label="AC"
          />
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
  return (
    <TreeView
      aria-label="gmail"
      defaultExpanded={["3"]}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      sx={{ height: "100%", flexGrow: 1, overflowY: "auto" }}
    >
      <StyledTreeItem
        nodeId="1"
        labelText="A-asnias"
        labelIcon={AssignmentIcon}
      />
      <StyledTreeItem
        disabled
        nodeId="3"
        labelText="A-asnias"
        labelIcon={AssignmentIcon}
      />
      <StyledTreeItem
        nodeId="4"
        labelText="B-ashuags"
        labelIcon={AssignmentIcon}
      />
      <StyledTreeItem nodeId="7" labelText="History" labelIcon={AssignmentIcon}>
        <StyledTreeItem
          nodeId="8"
          labelText="History"
          labelIcon={AssignmentIcon}
        />
      </StyledTreeItem>
      <StyledTreeItem
        nodeId="9"
        labelText="History"
        labelIcon={AssignmentIcon}
      />
      <StyledTreeItem
        nodeId="10"
        labelText="History"
        labelIcon={AssignmentIcon}
      />
      <StyledTreeItem
        nodeId="11"
        labelText="History"
        labelIcon={AssignmentIcon}
      />
    </TreeView>
  );
}
