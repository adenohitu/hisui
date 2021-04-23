import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import grey from "@material-ui/core/colors/grey";

import { Box } from "@material-ui/core";
// import { Badge } from "react-bootstrap";
// import IconButton from "@material-ui/core/IconButton";
// import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import {
  // requestStandingAsync,
  // sendGetmyrank,
  selectTotal,
  // selectUpdateTime,
  // setRank,
  // loadEnd,
} from "../../app/Slice/standings";
import { useSelector } from "react-redux";
// const colorgrey = grey[200];
const colorgreyboder = grey[300];
// const dayjs = require("dayjs");
const useStyles = makeStyles({
  root: { height: "100%" },
  table: {
    // height: "100%",
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
});
// let getdata: any = null;
// export const update_submission = () => {
//   getdata();
// };
export function Totaltable() {
  const classes = useStyles();
  // const [rows, setrows] = useState([]);
  // const [load, setload] = useState("ok");
  const rowdata = useSelector(selectTotal);
  //初回だけ実行

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tablecellborder}>Task</TableCell>
            {rowdata.map((row: any) => (
              <TableCell
                className={classes.tablecellborder}
                key={row.Assignment}
              >
                {row.Assignment}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell className={classes.tablecellborder}>
              <Box className={classes.actext}>AC</Box>
              <Box>/All</Box>
            </TableCell>
            {rowdata.map((row: any) => (
              <TableCell
                className={classes.tablecellborder}
                key={row.Assignment}
              >
                <Box className={classes.actext}>{row.submitAC}</Box>
                <Box>/{row.submitAll}</Box>
              </TableCell>
            ))}
          </TableRow>
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
