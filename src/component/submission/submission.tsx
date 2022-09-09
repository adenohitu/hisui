import React, { useEffect, useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Button, Typography } from "@mui/material";
import { MosaicWindowContext } from "react-mosaic-component";
import { ipcRendererManager } from "../../ipc";
import RefreshIcon from "@mui/icons-material/Refresh";
import { submissionData } from "../../../src_main/data/scraping/submissions";
import { ChipJudgeResult } from "../chip/judge-result";

const dayjs = require("dayjs");
const useStyles = makeStyles({
  root: { height: "100%", boxShadow: "none" },
  table: {
    minWidth: 650,
  },
});

export function SubmissionTable() {
  const classes = useStyles();
  const [rows, setrows] = useState<submissionData[]>([]);
  useEffect(() => {
    ipcRendererManager.on("LISTENER_RETUEN_SUBMISSIONS", (event, arg) => {
      setrows(arg);
      console.log(arg);
    });
  }, []);

  const openurl = (url: string) => {
    const open = `https://atcoder.jp${url}`;
    ipcRendererManager.invoke("OPEN_SUBMISSION_PAGE", open);
  };
  // //初回だけ実行
  useEffect(() => {
    //ipc送信関数
    ipcRendererManager.send("RUN_UPDATE_SUBMISSIONS");
  }, []);
  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table stickyHeader className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell size="small">提出日時</TableCell>
            <TableCell align="center">結果</TableCell>
            <TableCell align="left">問題</TableCell>
            <TableCell align="left">提出言語</TableCell>
            <TableCell align="right">実行時間</TableCell>
            <TableCell align="right">メモリ</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: submissionData) => (
            <TableRow key={row.created}>
              <TableCell>
                {dayjs(row.created).format("YY/MM/DD HH:mm:ss")}
              </TableCell>
              <TableCell align="center">
                <ChipJudgeResult result={row.result} />
              </TableCell>
              <TableCell align="left">
                <Typography
                  variant="body2"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    ipcRendererManager.send("CREATE_TASKCONT", {
                      contestName: row.contestName,
                      taskScreenName: row.taskScreenName,
                    });
                  }}
                >
                  {row.taskname_render}
                </Typography>
              </TableCell>
              <TableCell align="left">{row.language}</TableCell>
              <TableCell align="right">{row.time_consumption}</TableCell>
              <TableCell align="right">{row.memory_consumption}</TableCell>
              <TableCell align="right">
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => {
                    openurl(row.submit_url);
                  }}
                >
                  <OpenInNewIcon fontSize="inherit" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
const updateSubmissions = () => {
  ipcRendererManager.send("RUN_UPDATE_SUBMISSIONS");
};
/**
 * Submissionsデータを更新するボタン
 * MosaicContextのAdditionalControlを閉じる
 */
export class ReloadButtonAddtionals extends React.PureComponent {
  static contextType = MosaicWindowContext;
  context!: MosaicWindowContext;

  render() {
    return (
      <Box px={0.5}>
        <Button
          variant="contained"
          // size="small"
          style={{
            maxWidth: "90px",
            maxHeight: "20px",
            minWidth: "90px",
            minHeight: "20px",
          }}
          startIcon={<RefreshIcon />}
          onClick={() => {
            // 更新イベントを発行
            ipcRendererManager.send("RUN_UPDATE_SUBMISSIONS");
            // MosaicのAdditionalWindowを閉じる
            this.context.mosaicWindowActions.setAdditionalControlsOpen(false);
          }}
        >
          更新
        </Button>
      </Box>
    );
  }
}
/**
 * mosaicのtoolbarControlsに入れる
 */
export const ReloadButtonTool = () => {
  return (
    <IconButton
      size="small"
      aria-label="Refresh submissions"
      onClick={updateSubmissions}
    >
      <RefreshIcon />
    </IconButton>
  );
};
