import { settablerows, settableload } from "./ranktable";
import { setrank, setrankload, setupdatetime } from "./rank";
import dayjs from "dayjs";
//順位だけを取得するAPIがないためここで順位表情報を取得し順位表と順位に分けて渡す
const getdata = async () => {
  const check: boolean = await window.api.get_login_status_render();
  if (check) {
    const get: any = window.api.get_Standings_render;
    get("abc189").then((result: any) => {
      console.log(result);
      setdata(result);
    });
  } else {
    settableload("nologin");
  }
};

export const runLoad = () => {
  getdata();
};
const setdata = (result: any) => {
  settablerows(result.StandingsData);
  settableload("ok");
  const me = result.StandingsData.find((v: any) => v.UserScreenName === "");
  setrank(me);
  setrankload("ok");
  setupdatetime(dayjs().format("HH:mm"));
};
