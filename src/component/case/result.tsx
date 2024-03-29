import React, { useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import {
  elementStatus,
  elementStatusLoad,
  viewStateLoad,
} from "../../app/Slice/casecont";
import { RunCreateSample } from "./logic/samplecreate";
import { Layout } from "react-grid-layout";
import { ipcRendererManager } from "../../ipc";

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
    );
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
          <Typography>
            {sample.split("\n").map((str, index) => (
              <React.Fragment key={index}>
                {str}
                <br />
              </React.Fragment>
            ))}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={() => {
              ipcRendererManager.invoke("RUN_COPY_CLIPBOARD", sample);
            }}
            size="small"
          >
            コピー
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
