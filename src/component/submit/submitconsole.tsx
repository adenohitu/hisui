import { Box, Container, Grid, Paper } from "@material-ui/core";
import { MainEditor } from "../editor/editor";
import { Submissionstepper } from "./stepper";

export function Submitconsole() {
  return (
    <Box px={1}>
      <Box py={1}>
        <Submissionstepper />
      </Box>
      <Grid container spacing={3}>
        {/* codeview */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper style={{ height: 240 }}>
            <MainEditor />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper style={{ height: 250 }}>
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
    </Box>
  );
}
