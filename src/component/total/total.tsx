import React from "react";
import { makeStyles } from "@mui/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import grey from "@mui/material/colors/grey";

import { Box } from "@mui/material";
import { selectTotal } from "../../app/Slice/standings";
import { useSelector } from "react-redux";
const colorgreyboder = grey[300];
const useStyles = makeStyles({
  root: { height: "100%" },
  table: {},
  tablecellborder: {
    borderWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colorgreyboder,
    borderStyle: "solid",
  },
  actext: {
    color: "#558b2f",
  },
});

export function Totaltable() {
  const classes = useStyles();
  // const [rows, setrows] = useState([]);
  // const [load, setload] = useState("ok");
  const rowdata = useSelector(selectTotal);

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
    </TableContainer>
  );
}
