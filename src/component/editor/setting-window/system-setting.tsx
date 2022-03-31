import * as React from "react";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { SnippetDialog } from "./item/snippet";
import { ipcRendererManager } from "../../../ipc";
import SettingsIcon from "@mui/icons-material/Settings";
let handleClickOpen: () => void;
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export function SettingAppDialog() {
  const [open, setOpen] = React.useState(false);

  handleClickOpen = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    ipcRendererManager.on("LISTENER_OPEN_EDITOR_SETTING_DIALOG", () => {
      handleClickOpen();
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar variant="dense">
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              設定
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          <SnippetDialog />
          <Divider />
        </List>
      </Dialog>
    </div>
  );
}
export const OpenSettingTool = () => {
  return (
    <IconButton
      size="small"
      aria-label="Refresh submissions"
      onClick={handleClickOpen}
    >
      <SettingsIcon />
    </IconButton>
  );
};
