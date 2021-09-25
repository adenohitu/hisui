import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { atcoderCodeTestResult } from "../../../src_main/casetester/atcoder";
import dayjs from "dayjs";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});
const useStyles = makeStyles({
  root: { height: "100%" },
  table: {},
});
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
          {row.Result.Id}
        </TableCell>
        <TableCell align="left">{row.ansStatus}</TableCell>
        <TableCell align="left">
          {dayjs(row.Result.Created).format("HH:mm:ss")}
        </TableCell>
        <TableCell align="left">{row.Result.LanguageName}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
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
                  <TableCell component="th" scope="row">
                    {row.Result.ExitCode}
                  </TableCell>
                  <TableCell align="right">
                    {row.Result.TimeConsumption} ms
                  </TableCell>
                  <TableCell align="right">
                    {row.Result.MemoryConsumption} KB
                  </TableCell>
                </TableBody>
              </Table>
              <Typography variant="subtitle1" component="div">
                入力
              </Typography>
              <pre>
                <code>{row.Result.Input}</code>
              </pre>
              <Typography variant="subtitle1" component="div">
                出力
              </Typography>
              <pre>
                <code>{row.Stdout}</code>
              </pre>
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
            <TableCell align="left">Time</TableCell>
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
