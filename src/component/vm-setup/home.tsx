import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Stack,
} from "@mui/material";
import { VmSetupStepperDocker } from "./docker-judge/docker";
import { TransitionAlerts } from "../alert/alert";
import {
  DockerStatusContext,
  useDockerSetup,
} from "./docker-judge/docker-status-hooks";
import { VmStatusTable } from "./docker-judge/docker-status";
import RefreshIcon from "@mui/icons-material/Refresh";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

export function VmSetup() {
  const dockerStatusHooks = useDockerSetup();
  return (
    <Box sx={{ height: "100%", width: "100%", backgroundColor: "#ffffff" }}>
      <Container sx={{ marginTop: "10px" }}>
        <Typography variant="h4">
          ローカルジャッジ仮想マシン（試験機能）
        </Typography>
        <TransitionAlerts severity="warning">
          この機能は試験的な機能です。
          <br />
          既存のDockerの環境に影響を与える可能性があります。注意してください
        </TransitionAlerts>
        <DockerStatusContext.Provider value={dockerStatusHooks}>
          <Box mb={5}>
            <Card variant="outlined">
              <CardContent>
                <h1>ジャッジシステム状況</h1>
                <Box my={1}>
                  <Button
                    onClick={dockerStatusHooks.updateStatus}
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                  >
                    更新する
                  </Button>
                </Box>
                <VmStatusTable />
              </CardContent>
              <CardActions>
                {dockerStatusHooks.dockerVmStatusObject !== null && (
                  <Box mt={3}>
                    <Stack spacing={2} direction="row">
                      <Button
                        onClick={dockerStatusHooks.stopContainer}
                        variant="outlined"
                        startIcon={<StopCircleIcon />}
                      >
                        起動中のJudgeContainerを停止・削除する
                      </Button>
                      <Button
                        onClick={dockerStatusHooks.restartContainer}
                        variant="outlined"
                        startIcon={<ChangeCircleIcon />}
                      >
                        ジャッジコンテナを再起動する
                      </Button>
                    </Stack>
                  </Box>
                )}
              </CardActions>
            </Card>
          </Box>

          <VmSetupStepperDocker />
        </DockerStatusContext.Provider>
      </Container>
    </Box>
  );
}
