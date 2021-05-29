import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
import { Box, Grid, TextField } from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  elementStatus,
  elementStatusLoad,
  viewStateLoad,
} from "../../app/Slice/casecont";
import { RunCreateSample } from "./logic/samplecreate";
import { Layout } from "react-grid-layout";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});
const useInputNum = (initialValue: number) => {
  const [value, set] = useState(initialValue);
  return { value, onChange: (e: any) => set(e.target.value) };
};
export function ResultCard() {
  const classes = useStyles();
  const viewState = useSelector(viewStateLoad);
  const elementStatus = useSelector(elementStatusLoad);
  const seed = useInputNum(0);
  const [sample, setsample] = useState("");
  const createSample = async (
    viewState: Layout[],
    elementStatus: { [i: string]: elementStatus },
    seed: number
  ) => {
    const createData = String(
      await RunCreateSample(viewState, elementStatus, seed)
    ).replace(/r?n/g, "<br>");
    setsample(createData);
  };
  return (
    <Grid item>
      <Box py={1}>
        <TextField
          id="seed-input"
          label="Seed"
          helperText="Seed値"
          {...seed}
          type="number"
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            createSample(viewState, elementStatus, seed.value);
          }}
        >
          ランダム生成
        </Button>
      </Box>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <p>
            {sample.split("\n").map((str, index) => (
              <React.Fragment key={index}>
                {str}
                <br />
              </React.Fragment>
            ))}
          </p>
        </CardContent>
        <CardActions>
          <Button size="small">コピー</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
