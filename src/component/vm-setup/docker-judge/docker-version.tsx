import { Box, Button, Chip, Stack } from "@mui/material";
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

      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        mt={2}
        spacing={2}
      >
        {(dockerStatusHooks.dockerVersionStatus !== "ready" &&
          dockerStatusHooks.dockerVersionStatus === true && (
            <Chip label="OK" color="success" />
          )) ||
          (dockerStatusHooks.dockerVersionStatus === false && (
            <Chip label="Failure" color="error" />
          ))}
        <h2>{dockerStatusHooks.dockerVersionLog}</h2>
      </Stack>
    </Box>
  );
}
