import React from "react";
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
import Link from "@material-ui/core/Link";
var myscore = [
  {
    Id: 19312526,
    ElapsedTime: 71,
    Score: 10000,
    Num: 1,
    Pending: false,
    Created: "2021-01-10T21:01:11+09:00",
    TaskScreenName: "abc188_a",
    AssignmentName: "A",
    TaskName: "Three-Point Shot",
  },
  {
    Id: 19317994,
    ElapsedTime: 197,
    Score: 20000,
    Num: 1,
    Pending: false,
    Created: "2021-01-10T21:03:17+09:00",
    TaskScreenName: "abc188_b",
    AssignmentName: "B",
    TaskName: "Orthogonality",
  },
  {
    Id: 19344293,
    ElapsedTime: 3705,
    Score: 30000,
    Num: 2,
    Pending: false,
    Created: "2021-01-10T22:01:45+09:00",
    TaskScreenName: "abc188_c",
    AssignmentName: "C",
    TaskName: "ABC Tournament",
  },
  {
    Id: 0,
    ElapsedTime: 0,
    Score: 0,
    Num: 0,
    Pending: false,
    Created: "0001-01-01T00:00:00Z",
    TaskScreenName: "abc188_d",
    AssignmentName: "D",
    TaskName: "Snuke Prime",
  },
  {
    Id: 0,
    ElapsedTime: 0,
    Score: 0,
    Num: 0,
    Pending: false,
    Created: "0001-01-01T00:00:00Z",
    TaskScreenName: "abc188_e",
    AssignmentName: "E",
    TaskName: "Peddler",
  },
  {
    Id: 0,
    ElapsedTime: 0,
    Score: 0,
    Num: 0,
    Pending: false,
    Created: "0001-01-01T00:00:00Z",
    TaskScreenName: "abc188_f",
    AssignmentName: "F",
    TaskName: "+1-1x2",
  },
];

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
      // borderLeft: "1px solid rgba(224, 224, 224, 1)",
    },
  },
});

function createData(hash: {
  Id: number;
  ElapsedTime: number;
  Score: number;
  Num: number;
  Pending: boolean;
  Created: string;
  TaskScreenName: string;
  AssignmentName: string;
  TaskName: string;
}) {
  /**小数第2位まで*/
  const Score: number = hash.Score / 100;
  /**解いた回数（ACするまで）*/
  const Num: number = hash.Num;
  /**ジャッジ中等の時trueになる（非検証）*/
  const Pending: boolean = hash.Pending;
  /**初ACした日時ISO 8601で取得*/
  const Created: Date = new Date(hash.Created);
  /**開始からACまでの経過時間(秒)*/
  const ElapsedTime: number = hash.ElapsedTime;
  const min: number = Math.floor(ElapsedTime / 60);
  const sec: number = Math.floor(ElapsedTime % 60);
  let ElapsedTime_after: string | null = null;
  let Created_after: string | null = null;
  if (hash.Created === "0001-01-01T00:00:00Z") {
    Created_after = "";
    ElapsedTime_after = "";
  } else {
    Created_after = Created.toLocaleString();
    ElapsedTime_after = min.toString() + ":" + sec.toString();
  }
  /**初ACした問題の提出番号（例:abc188/submissions/19312526）*/
  const Id: number = hash.Id;
  /**問題のURLで使われている名前*/
  const TaskScreenName: string = hash.TaskScreenName;
  /**問題の識別文字（例:A）*/
  const AssignmentName: string = hash.AssignmentName;
  /**問題の正式名称*/
  const TaskName: string = hash.TaskName;
  return {
    ElapsedTime_after,
    Score,
    Num,
    Pending,
    Created_after,
    Id,
    TaskScreenName,
    AssignmentName,
    TaskName,
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  // function test() {
  //   const get: any = window.api.get_contest_list_render;
  //   get().then((result: any) => {
  //     console.log(result);
  //   });
  // }
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
          {row.AssignmentName}
        </TableCell>
        <TableCell>{row.TaskName}</TableCell>
        <TableCell align="right">{row.Score}</TableCell>
        <TableCell align="right">{row.ElapsedTime_after}</TableCell>
        <TableCell align="center">{row.Created_after}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                自分の提出
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">提出日時</TableCell>
                    <TableCell align="center">言語</TableCell>
                    <TableCell align="center">結果</TableCell>
                    <TableCell align="center">実行時間</TableCell>
                    <TableCell align="center">メモリ</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableCell component="th" scope="row" align="center">
                    2021-01-15 22:01:36
                  </TableCell>
                  <TableCell align="center">Python (3.8.2)</TableCell>
                  <TableCell align="center">AC</TableCell>
                  <TableCell align="center">70 ms</TableCell>
                  <TableCell align="center">16312 KB</TableCell>
                  <TableCell align="center">
                    <Link href="">詳細</Link>
                  </TableCell>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
// numは何回目の提出かがわかる
// ペナルティをcontest/contestnameからスクレイピングすることで最終結果を取得できる。

const rows = myscore.map((x) => {
  return createData(x);
});

export default function CollapsibleTable() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>#</TableCell>
            <TableCell>問題名</TableCell>
            <TableCell align="center">得点</TableCell>
            <TableCell align="center">経過時間</TableCell>
            <TableCell align="center">提出時間</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.AssignmentName} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
