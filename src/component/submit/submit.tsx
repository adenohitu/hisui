// import React from "react";
// import { Counter } from "../counter/Counter";
import { Box, Container, Grid, Paper, Typography } from "@material-ui/core";
import { useEffect } from "react";
import { Submissionstepper } from "./stepper";

export function Submitmain() {
  return (
    <Container>
      <Box py={1}>
        <Submissionstepper />
      </Box>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper style={{ height: 240 }}>
            <h1>test</h1>
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper style={{ height: 240 }}>
            <Container>
              <h1>test</h1>
            </Container>
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper style={{ height: 240 }}>
            <h1>test</h1>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
