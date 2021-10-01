import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { ipcRendererManager } from "../../ipc";
import { timeData } from "../../../src_main/clock/timer";
interface State {
  now: any;
  start: any;
  end: any;
  time: any;
  status: any;
}
//msを{Day日とHH:MM:SS}に変換
const convertTime = (time_ms: number) => {
  if (time_ms === -1) {
    return "--:--:--";
  }
  const second_module = Math.floor(time_ms / 1000);
  const second = ("00" + (second_module % 60)).slice(-2);
  const minute = ("00" + (Math.floor(second_module / 60) % 60)).slice(-2);
  const hour = ("00" + (Math.floor(second_module / 3600) % 24)).slice(-2);
  const day = Math.floor(second_module / 3600 / 24);
  if (day !== 0) {
    return day + "日と" + hour + ":" + minute + ":" + second;
  } else {
    return hour + ":" + minute + ":" + second;
  }
};

export function TimerSyncMain() {
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => {
    const update = (event: Electron.IpcRendererEvent, timeData: timeData) => {
      setStatus(timeData.status);
      setTime(convertTime(timeData.time));
    };
    ipcRendererManager.on("LISTENER_TIMER_TICK", update, true);
  }, []);
  return (
    <>
      <Typography variant="h6">{status}</Typography>
      <Typography variant="h5" align="center">
        {time}
      </Typography>
    </>
  );
}
export class Clock extends React.Component<{}, State> {
  private timerID: any = undefined;
  constructor(props: string) {
    super(props);
    this.state = {
      now: undefined,
      start: undefined,
      end: undefined,
      time: undefined,
      status: undefined,
    };
  }
  //コンテストの開始時刻と終了時刻を取得
  getData = async () => {
    const getdate = await ipcRendererManager.invoke("GET_CONTEST_DATE");
    const starttime = dayjs(getdate.start_time);
    const endtime = dayjs(getdate.end_time);
    this.setState({
      start: starttime,
      end: endtime,
    });
  };

  componentDidMount() {
    this.getData();
    this.timerID = setInterval(() => this.tick(), 500);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      now: dayjs(),
    });
    if (this.state.start !== undefined && this.state.end !== undefined) {
      if (this.state.now.isBefore(this.state.start)) {
        this.setState({
          status: "開始まで",
          time: convertTime(this.state.start.diff(this.state.now)),
        });
      } else if (this.state.now.isBefore(this.state.end)) {
        this.setState({
          status: "残り時間",
          time: convertTime(this.state.end.diff(this.state.now)),
        });
      } else {
        this.setState({
          status: "コンテストは終了しました",
          time: "--:--:--",
        });
      }
    }
  }
  render() {
    return (
      <>
        <Typography variant="h6">{this.state.status}</Typography>
        <Typography variant="h5" align="center">
          {this.state.time}
        </Typography>
      </>
    );
  }
}
