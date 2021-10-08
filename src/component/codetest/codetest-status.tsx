import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { atcoderCodeTestResult } from "../../../src_main/data/casetester/runtest_atcoder";
import { makeStyles } from "@mui/styles";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  pre: {
    backgroundColor: "#F2F2F2",
  },
});
const useStyles = makeStyles({
  root: { height: "100%" },
  table: {},
});
const ansStatusText = (arg: atcoderCodeTestResult) => {
  if (arg.ansStatus !== undefined) {
    return arg.ansStatus;
  } else {
    if (arg.Result.ExitCode === 0) {
      return "Runned";
    } else {
      return "Error";
    }
  }
};
const useTestStatus = () => {
  const [status, setstatus] = useState<atcoderCodeTestResult[]>([]);
  useEffect(() => {
    window.editor.codeTestStatusEvent((arg) => {
      function changeStatus(
        data: atcoderCodeTestResult,
        prev: atcoderCodeTestResult[]
      ) {
        const getIndex = prev.findIndex(
          (element) => element.Result.Id === data.Result.Id
        );

        if (getIndex === -1) {
          return [data, ...prev.slice(0, 9)];
        } else {
          prev.splice(getIndex, 1);
          return [data, ...prev];
        }
      }
      setstatus((prev) => changeStatus(arg, prev));
    });
  }, []);
  return { status, setstatus };
};

function Row(props: { row: atcoderCodeTestResult }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.TaskScreenName}
        </TableCell>
        <TableCell align="left">{ansStatusText(row)}</TableCell>
        <TableCell align="left">{row.Result.TimeConsumption} ms</TableCell>
        <TableCell align="left">{row.Result.LanguageName}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                詳細
              </Typography>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>終了コード</TableCell>
                    <TableCell align="right">実行時間</TableCell>
                    <TableCell align="right">メモリー</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.Result.Id}>
                    <TableCell scope="row">{row.Result.ExitCode}</TableCell>
                    <TableCell align="right">
                      {row.Result.TimeConsumption} ms
                    </TableCell>
                    <TableCell align="right">
                      {row.Result.MemoryConsumption} KB
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {row.Stderr !== "" && (
                <>
                  <Typography variant="subtitle1" component="div">
                    エラーメッセージ
                  </Typography>
                  <Box>
                    <pre className={classes.pre}>{row.Stderr}</pre>
                  </Box>
                </>
              )}
              <Typography variant="subtitle1" component="div">
                入力
              </Typography>
              <pre className={classes.pre}>{row.Result.Input}</pre>
              <Typography variant="subtitle1" component="div">
                出力
              </Typography>
              <pre className={classes.pre}>{row.Stdout}</pre>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export function CodeTestWindow() {
  const classes = useStyles();
  const data = useTestStatus();

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table stickyHeader className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Exec Time</TableCell>
            <TableCell align="left">language</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.status.map((row) => (
            <Row key={row.Result.Id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
