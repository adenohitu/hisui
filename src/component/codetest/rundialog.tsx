import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  DialogContentText,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { focuscodeTest } from "../editor/window_editor/editorwindow";
import { ipcRendererManager } from "../../ipc";
export let TestToolhandleClickOpen: () => void | undefined;
export default function TestTool() {
  const [input, setinput] = useState("");
  const [inputans, setinputans] = useState("");
  const [ans, setans] = useState(false);
  const runCodetest = () => {
    handleClose();
    focuscodeTest();
    if (ans) {
      ipcRendererManager.send("RUN_CODETEST_NOWTOP", input, inputans);
    } else {
      ipcRendererManager.send("RUN_CODETEST_NOWTOP", input, null);
    }
  };
  const [open, setOpen] = useState(false);

  TestToolhandleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth={false}
      >
        <DialogTitle id="form-dialog-title">テスト</DialogTitle>

        <DialogContent>
          <DialogContentText>コードをテストする</DialogContentText>
          <Box pt={1}>
            <Typography variant="subtitle1">標準入力</Typography>
            <TextField
              style={{ display: "flex" }}
              id="input"
              name="input"
              label="入力"
              multiline
              rows={3}
              variant="outlined"
              value={input}
              onChange={(event) => {
                setinput(event.target.value);
              }}
            />
          </Box>
          <Box pt={1}>
            <Typography style={{ display: "inline-block" }} variant="subtitle1">
              答え
            </Typography>
            <FormControlLabel
              style={{ display: "inline-block" }}
              control={
                <Checkbox
                  checked={ans}
                  onChange={(event) => {
                    setans(event.target.checked);
                  }}
                  name="checkedA"
                />
              }
              label="答えをチェックする"
            />

            <TextField
              style={{ display: "flex" }}
              disabled={ans === false && true}
              id="答え"
              name=""
              label="答え"
              multiline
              rows={3}
              variant="outlined"
              value={inputans}
              onChange={(event) => {
                setinputans(event.target.value);
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            戻る
          </Button>
          <Button color="secondary" onClick={runCodetest}>
            実行
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
