import { Box, Button } from "@mui/material";
import { VmStatusTable } from "./docker-status";
import RuleIcon from "@mui/icons-material/Rule";
import { useContext } from "react";
import { DockerStatusContext } from "./docker-status-hooks";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
export const DockerContainerStart = () => {
  const dockerStatusHooks = useContext(DockerStatusContext);
  return (
    <>
      <Box my={3}>
        <Button
          onClick={dockerStatusHooks.updateStatus}
          variant="outlined"
          startIcon={<RuleIcon />}
        >
          ジャッジコンテナの起動状況を確認する
        </Button>
      </Box>
      <VmStatusTable />
      {dockerStatusHooks.dockerVmStatus === "noContainer" && (
        <Box mt={3}>
          <Button
            onClick={dockerStatusHooks.startContainer}
            variant="outlined"
            startIcon={<PlayCircleOutlineIcon />}
          >
            ジャッジコンテナを起動する
          </Button>
        </Box>
      )}
      {dockerStatusHooks.dockerVmStatus === "down" && (
        <Box mt={3}>
          <Button
            onClick={dockerStatusHooks.restartContainer}
            variant="outlined"
            startIcon={<ChangeCircleIcon />}
          >
            ジャッジコンテナを再起動する
          </Button>
        </Box>
      )}
    </>
  );
};
