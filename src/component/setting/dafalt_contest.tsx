import React, { useState, createContext, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SelectContest from "./select_contestlist";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
// import { update_submission } from "../submission/submission";
// import { update_myscore } from "../score/myscore";
import { useDispatch } from "react-redux";
import { requestScoreAsync } from "../../app/Slice/score";
// import { requestStandingAsync } from "../../app/Slice/standings";
import { sendGetmysubmission } from "../../app/Slice/submissions";
// import store from "../../app/store";
// import { runLoad } from "../rank/get";
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export const TextContext = createContext(["", () => {}]);

export default function DefaltContest() {
  const dispatch = useDispatch();
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
    window.api.dafaltContestOpen(handleClickOpen);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const [open_snack, setOpen_snack] = React.useState(false);
  const [status_snack, setStatus_snack] = React.useState("");

  const getdefaltdata = async () => {
    const get: any = window.api.get_SetContestID_render;
    get().then((result: any) => {
      setText(result);
    });
  };
  const handleClose_snack = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen_snack(false);
  };
  const [formerror, set_formerror] = React.useState(false);
  const [messageerror, set_messageerror] = React.useState("");
  const set_contestID = () => {
    const get: any = window.api.set_SetContestID_render;
    get(text).then((result: any) => {
      if (result) {
        setStatus_snack(`${text}に設定しました`);
        setOpen_snack(true);
        //メインデータの更新
        dispatch(requestScoreAsync());
        // dispatch(requestStandingAsync());
        dispatch(sendGetmysubmission());
        //
        handleClose();
      } else {
        set_messageerror("存在しないコンテストまたは認証が必要です");
        set_formerror(true);
      }
    });
  };
  return (
    <div>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Snackbar
        open={open_snack}
        autoHideDuration={6000}
        onClose={handleClose_snack}
      >
        <Alert onClose={handleClose_snack} severity="success">
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
            <SelectContest />
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
