import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import { TextContext } from "./dafalt_contest";
import Button from "@material-ui/core/Button";
const dayjs = require("dayjs");
const useStyles = makeStyles({
  root: { width: "100%", t: "2px" },
  table: {
    width: "100%",
  },
});

export default function SelectContest(prop: any): any {
  const classes = useStyles();
  const [text, setText]: any = useContext(TextContext);
  const [rows, setrows] = useState([]);
  const getdata = async () => {
    const get: any = window.api.get_contest_list_render;
    get().then((result: any) => {
      console.log(result);
      setrows(result);
    });
  };
  useEffect(() => {
    getdata();
  }, []);
  return (
    <Box pt={2}>
      <TableContainer className={classes.root} component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="left">コンテスト名</TableCell>
              <TableCell align="center">開始時刻</TableCell>
              <TableCell align="center">Status</TableCell>
              {prop.select !== false && <TableCell align="center"></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any) => (
              <TableRow key={row.start_time}>
                <TableCell align="left">{row.contest_name}</TableCell>
                <TableCell align="center">
                  {dayjs(row.start_time).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell align="center">
                  {row.active ? (
                    <Chip size="small" label="開催中" color="secondary" />
                  ) : (
                    <Chip size="small" label="開催予定" />
                  )}
                </TableCell>
                {prop.select !== false && (
                  <TableCell align="center">
                    {row.contest_short_name === text ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          setText(row.contest_short_name);
                        }}
                        disabled
                      >
                        選択
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          setText(row.contest_short_name);
                        }}
                      >
                        選択
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
