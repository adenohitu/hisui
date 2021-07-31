import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import SpeedDial, { SpeedDialProps } from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SaveIcon from "@material-ui/icons/Save";
import SendIcon from "@material-ui/icons/Send";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import LanguageIcon from "@material-ui/icons/Language";
import { monacoControlApi } from "../editor";
import { SelectLanguageDialog } from "./languagedialog";

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
    },
  },
  { icon: <PlaylistAddCheckIcon />, name: "テスト", click: () => {} },
  {
    icon: <LanguageIcon />,
    name: "言語変更",
    click: () => {},
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
                if (action.name === "言語変更") {
                  dialogSetOpen(true);
                }
              }}
            />
          ))}
        </SpeedDial>
      </div>
    </>
  );
}
