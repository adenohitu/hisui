import React, { useState, useEffect, useContext } from "react";
import makeStyles from '@mui/styles/makeStyles';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { TextContext } from "./dafalt_contest";
import Button from "@mui/material/Button";
import { ipcRendererManager } from "../../ipc";
import { contest_list } from "../../../src_main/data/scraping/contest_list";
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
  const [rows, setrows] = useState<contest_list[]>([]);
  const getdata = async () => {
    const get: contest_list[] = await ipcRendererManager.invoke(
      "GET_CONTEST_LIST"
    );
    setrows(get);
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
              {prop.select === true && <TableCell align="center"></TableCell>}
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
                {prop.select === true && (
                  <TableCell align="center">
                    {row.taskScreenName === text ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          setText(row.taskScreenName);
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
                          setText(row.taskScreenName);
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
