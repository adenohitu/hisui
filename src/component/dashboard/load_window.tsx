import RankCard from "../rank/rank";
import SimpleCard from "../clock/window_time_card";
import CollapsibleTable, { ReloadButtonToolScore } from "../score/myscore";
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
    toolbarControls: React.Children.toArray([
      <ReloadButtonToolScore />,
      <RemoveButton />,
    ]),
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
  // editor: { name: "Editor", component: <MainEditor /> },
};
