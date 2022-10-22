import { Box, Button, Chip, Stack, Alert } from "@mui/material";
import { useContext } from "react";
import RuleIcon from "@mui/icons-material/Rule";
import { DockerStatusContext } from "./docker-status-hooks";
export function GetDockerVersion() {
  const dockerStatusHooks = useContext(DockerStatusContext);
  return (
    <Box my={2}>
      <Button
        onClick={dockerStatusHooks.checkDocker}
        variant="outlined"
        startIcon={<RuleIcon />}
      >
        Dockerのインストール状況をチェックする
      </Button>
      {dockerStatusHooks.dockerVersionStatus?.status === "error" &&
        dockerStatusHooks.dockerVersionStatus?.serverVersion === undefined && (
          <Alert severity="error">
            docker daemonが起動していない可能性があります
            <br />
            Docker Desktopを起動してください
          </Alert>
        )}
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        mt={2}
        spacing={2}
      >
        {dockerStatusHooks.dockerVersionStatus?.status === "error" && (
          <Chip label="Failure" color="error" />
        )}
        {dockerStatusHooks.dockerVersionStatus?.status === "success" && (
          <Chip label="OK" color="success" />
        )}
        <h2>{dockerStatusHooks.dockerVersionLog}</h2>
      </Stack>
    </Box>
  );
}
