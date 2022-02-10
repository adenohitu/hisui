import React from "react";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import SpeedDial, { SpeedDialProps } from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import LanguageIcon from "@mui/icons-material/Language";
import EditIcon from "@mui/icons-material/Edit";
import { monacoControlApi } from "../editor";
import {
  handleClickOpenSelectLanguageDialog,
  SelectLanguageDialog,
} from "./setting/languagedialog";
import { focusEditor, focussubmission } from "../window_editor/editorwindow";
import { customTestWindowOpen } from "../../codetest/run-window";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      transform: "translateZ(0px)",
      flexGrow: 1,
    },
    exampleWrapper: {
      position: "relative",
    },
    radioGroup: {
      margin: theme.spacing(1, 0),
    },
    speedDial: {
      position: "absolute",
      "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
        bottom: theme.spacing(2),
        right: theme.spacing(2),
      },
      "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
        top: theme.spacing(2),
        left: theme.spacing(2),
      },
    },
    paper: {
      width: "80%",
      maxHeight: 435,
    },
  })
);

const actions = [
  {
    icon: <SaveIcon />,
    name: "保存",
    click: () => {
      monacoControlApi?.saveNowValue();
    },
  },
  {
    icon: <SendIcon />,
    name: "提出",
    click: () => {
      window.editor.submitNowTop();
      focussubmission();
    },
  },
  {
    icon: <PlaylistAddCheckIcon />,
    name: "テスト",
    click: () => {
      if (customTestWindowOpen) customTestWindowOpen();
    },
  },
  {
    icon: <LanguageIcon />,
    name: "言語変更",
    click: () => {
      handleClickOpenSelectLanguageDialog();
    },
  },
  {
    icon: <EditIcon />,
    name: "エディターのみ",
    click: () => {
      focusEditor();
    },
  },
];

export default function SpeedDials() {
  const classes = useStyles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [direction, setDirection] =
    React.useState<SpeedDialProps["direction"]>("up");
  const [open, setOpen] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hidden, setHidden] = React.useState(false);
  // SelectLanguageDialogのHooks
  const [dialogOpen, dialogSetOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <>
      <SelectLanguageDialog open={dialogOpen} setOpen={dialogSetOpen} />
      <div className={classes.exampleWrapper}>
        <SpeedDial
          ariaLabel="EditorWindowControl"
          className={classes.speedDial}
          hidden={hidden}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          direction={direction}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              // tooltipOpen
              onClick={() => {
                handleClose();
                action.click();
              }}
            />
          ))}
        </SpeedDial>
      </div>
    </>
  );
}
