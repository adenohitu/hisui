import { Box, Grid, Paper } from "@material-ui/core";
import { MainEditor } from "../editor/editor";
import { EditorTool } from "../editor/tool/editortool";
import { JudgeResultList } from "./judgeresult";
import { Submissionstepper } from "./stepper";

export function Submitconsole() {
  return (
    <Box px={1}>
      <Box py={1}>
        <Submissionstepper />
      </Box>
      <Grid container spacing={3}>
        {/* codeview */}
        <Grid item xs={12} md={8} lg={8}>
          <Paper style={{ height: 240 }}>
            <MainEditor />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={4}>
          <Paper style={{ height: 240 }}>
            <EditorTool />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper>
            <JudgeResultList />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
