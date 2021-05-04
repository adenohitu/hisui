import { Box, Button, Grid, makeStyles, Theme } from "@material-ui/core";
import { CaseView } from "./caseview";
import { CaseAddMain } from "./caseadd";
import { useState } from "react";
import { StyledTabs, StyledTab } from "./tab";
import { ResultCard } from "./result";
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    padding: 10,
  },
  padding: {
    padding: theme.spacing(3),
  },
  main: {
    backgroundColor: theme.palette.background.paper,
  },
}));
const makeCaseList = [
  {
    id: 0,
    casename: "1行1列データ",
  },
  {
    id: 1,
    casename: "(1,N)行列データ",
  },
];
export function TestCaseBoard() {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label="styled tabs"
      >
        {makeCaseList.map((row) => (
          <StyledTab key={row.id} label={row.casename} />
        ))}
      </StyledTabs>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <CaseAddMain />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CaseView />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box py={1}>
            <Button variant="contained" color="secondary">
              ランダム生成
            </Button>
          </Box>

          <ResultCard />
        </Grid>
      </Grid>
    </div>
  );
}
