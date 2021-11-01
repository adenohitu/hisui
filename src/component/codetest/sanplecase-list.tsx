import { useState } from "react";
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
import { SampleCase } from "../../../src_main/data/scraping/samplecase";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";

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
function Row(props: {
  row: SampleCase;
  runSample: (inputarg: string, ans: undefined | string) => void;
  setinput: (value: string) => void;
  issetans: (value: boolean) => void;
  setinputans: (value: string) => void;
}) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();
  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
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
          入力例{row.name}
        </TableCell>
        <TableCell align="right">
          <Button
            color="error"
            onClick={() => {
              if (row.case) props.setinput(row.case);
              if (row.answer) {
                props.issetans(true);
                props.setinputans(row.answer);
              } else {
                props.issetans(false);
              }
              props.runSample(row.case, row.answer);
            }}
          >
            実行
          </Button>
        </TableCell>
        <TableCell align="right">
          <Button
            onClick={() => {
              if (row.case) props.setinput(row.case);
              if (row.answer) {
                props.issetans(true);
                props.setinputans(row.answer);
              } else {
                props.issetans(false);
              }
            }}
          >
            コピー
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                入力
              </Typography>
              <Box>
                <pre className={classes.pre}>{row.case}</pre>
              </Box>
              {row.case !== undefined && (
                <>
                  <Typography variant="h6" gutterBottom component="div">
                    答え
                  </Typography>
                  <Box>
                    <pre className={classes.pre}>{row.answer}</pre>
                  </Box>
                </>
              )}

              <div></div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
type Props = {
  runSample: (inputarg: string, ans: string | undefined) => void;
  setinput: (value: string) => void;
  issetans: (value: boolean) => void;
  setinputans: (value: string) => void;
  caseList: SampleCase[];
};

export const SampleCaseList: React.FC<Props> = ({
  children,
  runSample,
  setinput,
  issetans,
  setinputans,
  caseList,
}) => {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h4">ケース一覧</Typography>
      {caseList.length === 0 && (
        <Typography variant="subtitle1">
          問題が選択されていない、またはサンプルケースがない可能性があります
        </Typography>
      )}
      {caseList.length !== 0 && (
        <Table size="small" aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">サンプル名</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {caseList.map((row) => (
              <Row
                setinput={setinput}
                issetans={issetans}
                setinputans={setinputans}
                runSample={runSample}
                key={row.name}
                row={row}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};
