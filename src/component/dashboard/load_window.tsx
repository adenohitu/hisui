import RankCard from "../rank/rank";
import SimpleCard from "../clock/window_time_card";
import CollapsibleTable from "../score/myscore";
import { ReloadButtonTool, SubmissionTable } from "../submission/submission";
import { Totaltable } from "../total/total";
import React from "react";
import { RemoveButton } from "../mosaic/buttons/RemoveButton";
export const TITLE_ELEMENT: {
  [viewId: string]: {
    name: string;
    component: JSX.Element;
    toolbarControls:
      | (React.ReactChild | React.ReactFragment | React.ReactPortal)[]
      | undefined;
  };
} = {
  time: {
    name: "時間",
    component: <SimpleCard />,
    toolbarControls: React.Children.toArray([<RemoveButton />]),
  },
  score: {
    name: "得点表",
    component: <CollapsibleTable />,
    toolbarControls: React.Children.toArray([<RemoveButton />]),
  },
  rank: {
    name: "自分の順位",
    component: <RankCard />,
    toolbarControls: React.Children.toArray([<RemoveButton />]),
  },
  totaltable: {
    name: "提出状況",
    component: <Totaltable />,
    toolbarControls: React.Children.toArray([<RemoveButton />]),
  },
  submission: {
    name: "提出一覧",
    component: <SubmissionTable />,
    toolbarControls: React.Children.toArray([
      <ReloadButtonTool />,
      <RemoveButton />,
    ]),
  },
  // editor: { name: "Editor", component: <MainEditor /> },
};
