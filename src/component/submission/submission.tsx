import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { Box, Button, Typography } from "@mui/material";
import { MosaicWindowContext } from "react-mosaic-component";
import { ipcRendererManager } from "../../ipc";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ChipJudgeResult } from "../chip/judge-result";
import { submissionData } from "../../../src_main/data/submissions-type";
import { useSubmisisons } from "./submissions-hooks";
const dayjs = require("dayjs");
const useStyles = makeStyles({
  root: { height: "100%", boxShadow: "none" },
  table: {
    minWidth: 500,
  },
});

export function SubmissionTable() {
  const classes = useStyles();
  const submissionhooks = useSubmisisons();
  const openurl = (url: string) => {
    const open = `https://atcoder.jp${url}`;
    ipcRendererManager.invoke("OPEN_SUBMISSION_PAGE", open);
  };

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table stickyHeader className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "80px" }} align="left">
              提出日時
            </TableCell>
            <TableCell sx={{ width: "80px" }} size="small" align="center">
              結果
            </TableCell>
            <TableCell size="medium" align="left">
              問題
            </TableCell>
            <TableCell sx={{ width: "130px" }} align="left">
              提出言語
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {submissionhooks.rows.map((row: submissionData, index) => (
            <TableRow key={index}>
              <TableCell size="small">
                {dayjs(row.created).format("YY/MM/DD")}
                <br />
                {dayjs(row.created).format("HH:mm:ss")}
              </TableCell>
              <TableCell align="center">
                <ChipJudgeResult result={row.result} />
              </TableCell>
              <TableCell
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  openurl(row.submit_url);
                }}
                align="left"
              >
                <Typography variant="body2"></Typography>
                {row.contestName}
                <br />
                <Typography variant="body1">{row.taskname_render}</Typography>
              </TableCell>
              <TableCell align="left">{row.language}</TableCell>
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
