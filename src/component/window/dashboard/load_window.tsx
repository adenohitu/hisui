import RankCard from "../../rank/rank";
import SimpleCard from "../../clock/window_time_card";
import CollapsibleTable from "../../score/myscore";
import DataTable from "../../submission/submission";
// import Ranktable from "../../rank/ranktable";
import { Totaltable } from "../../total/total";
// import { MainEditor } from "../component/editor/editor";
export const TITLE_ELEMENT: {
  [viewId: string]: { name: string; component: JSX.Element };
} = {
  time: { name: "時間", component: <SimpleCard /> },
  score: {
    name: "得点表",
    component: <CollapsibleTable />,
  },
  rank: { name: "自分の順位", component: <RankCard /> },
  totaltable: { name: "提出状況", component: <Totaltable /> },
  submission: { name: "提出一覧", component: <DataTable /> },
  // editor: { name: "Editor", component: <MainEditor /> },
};
