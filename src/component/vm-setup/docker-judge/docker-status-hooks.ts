import { createContext, useState } from "react";
import {
  checkDockerInstalledReturn,
  dockerPSReturn,
  getDockerHisuiJudgeContainerStatusReturn,
} from "../../../../src_main/vm-system/vm-docker";
import { ipcRendererManager } from "../../../ipc";

export const useDockerSetup = () => {
  // Stepperに関するState
  const [activeStep, setActiveStep] = useState(0);
  const [nextOk, setNextOk] = useState<boolean>(false);
  // Dockerのインストールチェックに関するState
  const [dockerVersionLog, setDockerVersionLog] = useState<string>("");
  const [dockerVersionStatus, setDockerVersionStatus] = useState<
    boolean | "ready"
  >("ready");
  // コンテナ起動に関するState
  const [dockerVmStatusObject, setDockerVmStatusObject] =
    useState<dockerPSReturn | null>(null);
  const [dockerVmStatus, setDockerVmStatus] = useState<
    "up" | "noContainer" | "error" | "down" | null
  >(null);
  const [dockerRunStatus, setDockerRunStatus] = useState<
    "success" | "error" | "waiting" | null
  >(null);

  /**
   * Dockerのインストール状況を確認する
   * バーションを取得
   */
  const checkDocker = async () => {
    const getStatus: checkDockerInstalledReturn =
      await ipcRendererManager.invoke("GET_DOCKER_VERSION");
    setDockerVersionLog(getStatus.stdout);
    if (getStatus.status !== "error") {
      setDockerVersionStatus(true);
      setNextOk(true);
    } else {
      setDockerVersionStatus(false);
    }
  };
  /**
   * コンテナ（adenohitu/hisui-judge-docker）の起動状況を取得
   */
  const updateStatus = async () => {
    const getDockerStatus: getDockerHisuiJudgeContainerStatusReturn =
      await ipcRendererManager.invoke("GET_DOCKER_HISUIJUDGECONTAINER_STATUS");
    if (getDockerStatus.result) {
      setDockerVmStatusObject(getDockerStatus.result);
    } else {
      setDockerVmStatusObject(null);
    }
    if (getDockerStatus.status === "up") {
      setNextOk(true);
    } else {
      setNextOk(false);
    }
    setDockerVmStatus(getDockerStatus.status);
  };

  const startContainer = async () => {
    if (dockerVmStatus === "noContainer") {
      setDockerRunStatus("waiting");
      const waitRun: "success" | "error" = await ipcRendererManager.invoke(
        "RUN_DOCKER_START_HISUIJUDGECONTAINER"
      );
      if (waitRun === "success") {
        setNextOk(true);
        setDockerRunStatus("success");
        updateStatus();
      } else {
        setDockerRunStatus("error");
      }
    }
  };
  const stopContainer = async () => {
    const waitRun: "success" | "error" = await ipcRendererManager.invoke(
      "RUN_DOCKER_STOP_HISUIJUDGECONTAINER"
    );
    if (waitRun === "success") {
      setDockerRunStatus(null);
      updateStatus();
    } else {
      setDockerRunStatus("error");
    }
  };
  const reStartContainer = async () => {
    const waitRun: "error" | "success" | "stopError" =
      await ipcRendererManager.invoke("RUN_DOCKER_RESTART_HISUIJUDGECONTAINER");
    if (waitRun === "success") {
      setNextOk(true);
      setDockerRunStatus("success");
      updateStatus();
    } else {
      setDockerRunStatus("error");
    }
  };

  const handleNext = () => {
    setNextOk(false);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const resetStep = () => {
    setActiveStep(0);
    setNextOk(false);
    setDockerVersionLog("");
    setDockerVersionStatus("ready");
    setDockerVmStatus(null);
    setDockerRunStatus(null);
  };

  return {
    activeStep,
    setActiveStep,
    nextOk,
    setNextOk,
    dockerVersionLog,
    setDockerVersionLog,
    dockerVersionStatus,
    setDockerVersionStatus,
    dockerVmStatusObject,
    setDockerVmStatusObject,
    dockerVmStatus,
    setDockerVmStatus,
    dockerRunStatus,
    setDockerRunStatus,
    startContainer,
    stopContainer,
    restartContainer: reStartContainer,
    updateStatus,
    checkDocker,
    handleNext,
    resetStep,
  };
};
type statusContextTypes = ReturnType<typeof useDockerSetup>;
export const DockerStatusContext = createContext<statusContextTypes>(
  {} as statusContextTypes
);
