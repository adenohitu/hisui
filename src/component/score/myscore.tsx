import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, IconButton, Typography } from "@mui/material";
import lightGreen from "@mui/material/colors/lightGreen";
import yellow from "@mui/material/colors/yellow";
import { useSelector, useDispatch } from "react-redux";
import { selectscoreData, requestScoreAsync } from "../../app/Slice/score";
import { selectTotal } from "../../app/Slice/standings";
import grey from "@mui/material/colors/grey";
import RefreshIcon from "@mui/icons-material/Refresh";

// import store from "../../app/store";
const dayjs = require("dayjs");
//大枠の要素にもheight: "100%"を付ける
const colorgreyboder = grey[300];
const useStyles = makeStyles({
  root: { height: "100%" },
  table: {},
  ac: { backgroundColor: lightGreen[200] },
  wa: { backgroundColor: yellow[200] },
  backdrop: {
    // zIndex: zIndex.drawer + 1,
    color: "#fff",
  },
  tablecellborder: {
    borderWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colorgreyboder,
    borderStyle: "solid",
    // backgroundColor: colorgrey,
  },
  actext: {
    color: "#558b2f",
  },
  watext: { color: "#f44336" },
});
export default function BasicTable() {
  const classes = useStyles();
  const scoreData = useSelector(selectscoreData);
  const totalRowdata = useSelector(selectTotal);
  // const load = useSelector(selectload);
  const dispatch = useDispatch();
  // const [rows, setrows] = useState([]);
  //提出時刻を出力
  const Created = (date: string, num: number) => {
    return (
      <TableCell align="right">
        <Typography variant="body2" color="primary">
          {date !== "0001-01-01T00:00:00Z" && dayjs(date).format("HH:mm:ss")}
        </Typography>
        <Typography variant="body2" className={classes.watext}>
          {num !== 0 && num !== 1 && "(" + (num - 1) + ")"}
        </Typography>

        <Typography variant="body2">
          {date === "0001-01-01T00:00:00Z" && num === 0 && "未提出"}
        </Typography>
      </TableCell>
    );
  };
  //問題が正解しているか不正解かで色を指定するClassを返す
  const setRowColor = (date: string, num: number) => {
    if (date !== "0001-01-01T00:00:00Z") {
      return classes.ac;
    } else {
      if (date === "0001-01-01T00:00:00Z" && num !== 0) {
        return classes.wa;
      } else {
        return;
      }
    }
  };

  const checkAC = (date: string, num: number) => {
    if (date !== "0001-01-01T00:00:00Z") {
      return true;
    } else {
      if (date === "0001-01-01T00:00:00Z" && num !== 0) {
        return false;
      } else {
        return false;
      }
    }
  };
  const AcElapsedTime = (ElapsedTime: number) => {
    if (ElapsedTime !== 0) {
      const hour = Math.floor(ElapsedTime / 60);
      const minute = Math.floor(ElapsedTime % 60);
      return (
        <TableCell align="right">
          {hour}:{("00" + minute).slice(-2)}
        </TableCell>
      );
    } else {
      return <TableCell align="right">--:--</TableCell>;
    }
  };
  const totalData = (row: any, taskname: any, check: boolean) => {
    const data: any = row.find(
      (element: any) => element.TaskScreenName === taskname
    );
    if (check) {
      return (
        <TableCell>
          <Box>{data !== undefined && data.submitAC}</Box>
          <Box>{data !== undefined && "/" + data.submitAll}</Box>
        </TableCell>
      );
    } else {
      return (
        <TableCell>
          <Box className={classes.actext}>
            {data !== undefined && data.submitAC}
          </Box>
          <Box>{data !== undefined && "/" + data.submitAll}</Box>
        </TableCell>
      );
    }
  };
  //初回だけ実行

  useEffect(() => {
    dispatch(requestScoreAsync());
  }, [dispatch]);
  return (
    <>
      {/* <Backdrop className={classes.backdrop} open={load}>
        <CircularProgress color="inherit" />
      </Backdrop> */}
      <TableContainer className={classes.root} component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>問題名</TableCell>
              <TableCell align="right">得点</TableCell>
              <TableCell align="right">経過時間</TableCell>
              <TableCell align="right">提出時刻</TableCell>
              <TableCell className={classes.tablecellborder}>
                <Box className={classes.actext}>AC</Box>
                <Box>/All</Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scoreData.map((row: any) => (
              <TableRow
                className={setRowColor(row.Created, row.Num)}
                key={row.AssignmentName}
              >
                <TableCell component="th" scope="row">
                  {row.AssignmentName}
                </TableCell>
                <TableCell align="left">{row.TaskName}</TableCell>
                <TableCell align="right">{row.Score / 100}</TableCell>
                {AcElapsedTime(row.ElapsedTime)}
                {Created(row.Created, row.Num)}
                {totalData(
                  totalRowdata,
                  row.TaskScreenName,
                  checkAC(row.Created, row.Num)
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
export const ReloadButtonToolScore = () => {
  const dispatch = useDispatch();
  return (
    <IconButton
      size="small"
      aria-label="Refresh submissions"
      onClick={() => {
        dispatch(requestScoreAsync());
      }}
    >
      <RefreshIcon />
    </IconButton>
  );
};
