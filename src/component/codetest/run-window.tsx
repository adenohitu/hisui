import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { SampleCaseList } from "./sanplecase-list";
import { Box } from "@mui/system";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import { ipcRendererManager } from "../../ipc";
import { SampleCase } from "../../../src_main/data/scraping/samplecase";
import { focuscodeTest } from "../editor/window_editor/editorwindow";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export var customTestWindowOpen: (() => void) | null = null;

export function CustomTestWindow() {
  const [open, setOpen] = useState(false);
  const [caseList, setcaseList] = useState<SampleCase[]>([]);
  const [input, setinput] = useState("");
  const [inputans, setinputans] = useState<string | undefined>(undefined);
  const [isans, issetans] = useState(false);
  const runCodetest = (inputarg: string, ans: string | undefined) => {
    handleClose();
    focuscodeTest();
    if (ans) {
      ipcRendererManager.send("RUN_CODETEST_NOWTOP", inputarg, ans);
    } else {
      ipcRendererManager.send("RUN_CODETEST_NOWTOP", inputarg, null);
    }
  };
  customTestWindowOpen = () => {
    (async () => {
      const caseDataList: SampleCase[] | "not_saved" | "request_Error" =
        await ipcRendererManager.invoke("GET_NOWTOP_TASK_SAMPLECASE");
      if (caseDataList !== "not_saved" && caseDataList !== "request_Error") {
        setcaseList(caseDataList);
      }
    })();
    setOpen(true);
  };

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
              コードテスト
            </Typography>
          </Toolbar>
        </AppBar>
        <Box pt={1} p={3}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <SampleCaseList
                setinput={setinput}
                issetans={issetans}
                setinputans={setinputans}
                caseList={caseList}
                runSample={runCodetest}
              />
            </Grid>
            <Grid xs={4} item>
              <Typography variant="h4" id="form-dialog-title">
                テスト
              </Typography>
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
                <Typography
                  style={{ display: "inline-block" }}
                  variant="subtitle1"
                >
                  答え
                </Typography>
                <FormControlLabel
                  style={{ display: "inline-block" }}
                  control={
                    <Checkbox
                      checked={isans}
                      onChange={(event) => {
                        issetans(event.target.checked);
                      }}
                      name="checkedA"
                    />
                  }
                  label="答えをチェックする"
                />

                <TextField
                  style={{ display: "flex" }}
                  disabled={isans === false && true}
                  id="答え"
                  name="答え"
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
              <Button color="inherit" onClick={handleClose}>
                戻る
              </Button>
              <Button
                color="secondary"
                onClick={() => {
                  if (isans) {
                    runCodetest(input, inputans);
                  } else {
                    runCodetest(input, undefined);
                  }
                }}
              >
                実行
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </div>
  );
}
