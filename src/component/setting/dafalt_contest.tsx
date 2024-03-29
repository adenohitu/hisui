import React, { useState, createContext, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SelectContest from "./select_contestlist";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { ipcRendererManager } from "../../ipc";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export const TextContext = createContext(["", () => {}]);

export default function DefaltContest() {
  const [open, setOpen] = useState(false);
  const [text, setText]: any = useState("");
  const handleChange = (event: any) => {
    setText(event.target.value);
  };

  useEffect(() => {
    const handleClickOpen = () => {
      getdefaltdata();
      setOpen(true);
      set_messageerror("");
      set_formerror(false);
      // console.log("test1111");
    };
    ipcRendererManager.on(
      "LISTENER_OPEN_DEFAULT_DIALOG",
      handleClickOpen,
      true
    );
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const [open_snack, setOpen_snack] = React.useState(false);
  const [status_snack, setStatus_snack] = React.useState("");

  const getdefaltdata = async () => {
    const data = await ipcRendererManager.invoke("GET_SET_CONTESTID");
    setText(data);
  };
  const handleClose_snack = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen_snack(false);
  };
  const [formerror, set_formerror] = React.useState(false);
  const [messageerror, set_messageerror] = React.useState("");
  const set_contestID = async () => {
    const check = await ipcRendererManager.invoke("SET_CONTESTID", text);
    if (check) {
      setStatus_snack(`${text}に設定しました`);
      setOpen_snack(true);
      handleClose();
    } else {
      set_messageerror("存在しないコンテストまたは認証が必要です");
      set_formerror(true);
    }
  };
  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={open_snack}
        autoHideDuration={6000}
        onClose={handleClose_snack}
      >
        <Alert
          onClose={handleClose_snack}
          severity="success"
          sx={{ width: "100%" }}
        >
          {status_snack}
        </Alert>
      </Snackbar>
      <TextContext.Provider value={[text, setText]}>
        <Dialog
          fullWidth={true}
          maxWidth="lg"
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">コンテストを選択</DialogTitle>
          <DialogContent>
            <DialogContentText>
              参加するコンテストを選択してください
              （表示されてないときは直接入力してください）
              <br />
              ヒント:スラッシュ（/）が入っていないことを確認してください
            </DialogContentText>
            <TextField
              error={formerror}
              autoFocus
              value={text}
              margin="dense"
              id="contest_name"
              label="URLの後ろについている名前を入力　例:abc191"
              type="string"
              fullWidth
              onChange={handleChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  set_contestID();
                }
              }}
              helperText={messageerror}
            />
            <SelectContest select={true} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              戻る
            </Button>
            <Button onClick={set_contestID} color="primary">
              決定
            </Button>
          </DialogActions>
        </Dialog>
      </TextContext.Provider>
    </div>
  );
}
