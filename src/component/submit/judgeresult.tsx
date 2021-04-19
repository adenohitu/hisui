import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
// import { Typography } from "@material-ui/core";
import { Badge } from "react-bootstrap";
import IconButton from "@material-ui/core/IconButton";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import { selectSubmissions } from "../../app/Slice/submissions";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";

const dayjs = require("dayjs");
const useStyles = makeStyles({
  root: { height: "100%" },
  table: {
    minWidth: 650,
  },
});

export function JudgeResultList() {
  const classes = useStyles();
  // const [rows, setrows] = useState([]);
  // const [load, setload] = useState("ok");
  const rowdata = useSelector(selectSubmissions);
  //   const dispatch = useDispatch();
  const openurl = (url: string) => {
    const open = `https://atcoder.jp${url}`;
    window.api.urlOpen_render(open);
  };
  //初回だけ実行

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table stickyHeader className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell size="small">提出日時</TableCell>
            <TableCell align="left">問題</TableCell>
            <TableCell align="center">結果</TableCell>
            <TableCell align="right">実行時間</TableCell>
            <TableCell align="right">メモリ</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowdata.map((row: any) => (
            <TableRow key={row.created}>
              <TableCell>
                {dayjs(row.created).format("YY/MM/DD HH:mm:ss")}
              </TableCell>
              <TableCell align="left">{row.task}</TableCell>
              <TableCell align="center">
                {row.result === "AC" && (
                  <Badge pill variant="success">
                    {row.result}
                  </Badge>
                )}
                {row.result !== "AC" && (
                  <Badge pill variant="warning">
                    {row.result}
                  </Badge>
                )}
              </TableCell>
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
      {/* {load !== "ok" && (
        <Typography variant="h6" align="center">
          {load}
        </Typography>
      )} */}
    </TableContainer>
  );
}
