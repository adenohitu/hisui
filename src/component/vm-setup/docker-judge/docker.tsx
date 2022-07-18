import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { Fragment, useContext } from "react";
import { GetDockerVersion } from "./docker-version";
import { DockerStatusContext } from "./docker-status-hooks";
import { DockerContainerStart } from "./docker-start";
const steps = [
  {
    title: "Dockerのインストール",
    component: (
      <>
        <GetDockerVersion />
      </>
    ),
  },
  {
    title: "Dockerコンテナの起動",
    component: (
      <>
        <DockerContainerStart />
      </>
    ),
  },
  {
    title: "準備完了",
    component: (
      <>
        <h1>全ての準備が整いました。</h1>
      </>
    ),
  },
];

export function VmSetupStepperDocker() {
  const dockerStatusHooks = useContext(DockerStatusContext);

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={dockerStatusHooks?.activeStep}>
        {steps.map((step, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={index} {...stepProps}>
              <StepLabel {...labelProps}>{step.title}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Fragment>
        {steps[dockerStatusHooks.activeStep].component}
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button
            disabled={dockerStatusHooks.nextOk === false}
            onClick={dockerStatusHooks.handleNext}
          >
            次へ
          </Button>
          <Button
            disabled={dockerStatusHooks.activeStep !== steps.length - 1}
            onClick={dockerStatusHooks.resetStep}
          >
            最初に戻る
          </Button>
        </Box>
      </Fragment>
    </Box>
  );
}
