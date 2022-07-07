import { execFile, spawn } from "child_process";
import { promisify } from "util";
import { logger } from "../tool/logger/logger";
export interface dockerPSReturn {
  Command: string;
  CreatedAt: string;
  ID: string;
  Image: string;
  Labels: string;
  LocalVolumes: string;
  Mounts: "";
  Names: string;
  Networks: string;
  Ports: string;
  RunningFor: string;
  Size: string;
  State: string;
  Status: string;
}
export interface getDockerHisuiJudgeContainerStatusReturn {
  status: "up" | "noContainer" | "error" | "down";
  stderr?: string;
  result?: dockerPSReturn;
}
export interface checkDockerInstalledReturn {
  status: "success" | "error";
  stdout: string;
}
class vmDocker {
  /**
   * Dockerのバージョンを調べて、インストール済みかを確認する
   */
  async checkDockerInstalled(): Promise<checkDockerInstalledReturn> {
    return new Promise((resolve) => {
      execFile("docker", ["--version"], (error, stdout, stderr) => {
        if (error) {
          resolve({ status: "error", stdout: stderr });
        } else if (!stdout.includes("Docker version")) {
          resolve({ status: "error", stdout: stdout });
        }
        resolve({ status: "success", stdout: stdout });
      });
    });
  }
  async getDockerHisuiJudgeContainerStatus(): Promise<getDockerHisuiJudgeContainerStatusReturn> {
    return new Promise((resolve) => {
      execFile(
        "docker",
        ["ps", "-a", `--format={{json .}}`],
        (error, stdout, stderr) => {
          if (error) {
            resolve({ status: "error", stderr: stderr });
          }
          const parsedData: dockerPSReturn[] = stdout
            .split(/\r?\n/)
            .map((arg) => {
              if (arg === "") {
                return undefined;
              } else {
                return JSON.parse(arg);
              }
            })
            .filter((a) => a !== undefined);
          const getHisuiJudgeDockerStatus =
            parsedData.find(
              (a) =>
                a.Names === "hisui-judge-docker" &&
                a.Image.includes("adenohitu/hisui-judge-docker")
            ) || undefined;
          console.log(getHisuiJudgeDockerStatus);

          if (getHisuiJudgeDockerStatus === undefined) {
            resolve({ status: "noContainer" });
          } else {
            if (getHisuiJudgeDockerStatus.State === "running") {
              resolve({ status: "up", result: getHisuiJudgeDockerStatus });
            } else {
              resolve({ status: "down", result: getHisuiJudgeDockerStatus });
            }
          }
        }
      );
    });
  }
  async startDockerHisuiJudge(): Promise<"success" | "error"> {
    return new Promise((resolve) => {
      logger.info("docker Start event", "vmDockerApi");
      const shellDockerRun = spawn("docker", [
        "run",
        "-it",
        "-d",
        "--name=hisui-judge-docker",
        "adenohitu/hisui-judge-docker",
      ]);
      shellDockerRun.stderr.on("data", (data) => {
        logger.error(data.toString(), "vmDockerApi");
      });
      shellDockerRun.stdout.on("data", (data) => {
        logger.info(data.toString(), "vmDockerApi");
      });
      shellDockerRun.on("close", async (code) => {
        if (code === 0) {
          logger.info("docker Start:success", "vmDockerApi");
          resolve("success");
        } else {
          resolve("error");
        }
      });
    });
  }
  async stopDockerHisuiJudge(): Promise<"success" | "error"> {
    const nowContainerStatus = await this.getDockerHisuiJudgeContainerStatus();
    if (nowContainerStatus && nowContainerStatus.result) {
      try {
        await promisify(execFile)("docker", [
          "rm",
          "-f",
          nowContainerStatus.result.ID,
        ]);
        logger.info("docker Stop:success", "vmDockerApi");
        return "success";
      } catch (error) {
        logger.error("docker rm:error", "vmDockerApi");
        return "error";
      }
    } else {
      return "success";
    }
  }
  async restartDockerHisuiJudge() {
    const stopStatus = await this.stopDockerHisuiJudge();
    if (stopStatus === "success") {
      const startStatus = await this.startDockerHisuiJudge();

      return startStatus;
    } else {
      return "stopError";
    }
  }
}
export const vmDockerApi = new vmDocker();
