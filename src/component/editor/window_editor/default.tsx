import React from "react";
import { CodeTestWindow } from "../../codetest/codetest-status";
import { MainEditor } from "../editor";
import { ReloadButtonTool, SubmissionTable } from "../../submission/submission";
import { MosaicNode } from "react-mosaic-component";
import { OpenSettingTool } from "../../setting/system-setting";
import { monacoElement } from "../../mosaic/mosaic-hooks";
export const TITLE_ELEMENT: monacoElement = {
  editor: {
    name: "code",
    component: <MainEditor />,
    toolbarControls: React.Children.toArray([<OpenSettingTool />]),
  },
  submission: {
    name: "提出一覧",
    component: <SubmissionTable />,
    toolbarControls: React.Children.toArray([<ReloadButtonTool />]),
  },
  codeTest: {
    name: "テスト結果:AtCoderCustomTest",
    component: <CodeTestWindow />,
    toolbarControls: [],
  },
};
export const initial: MosaicNode<string> = {
  direction: "column",
  first: "editor",
  second: {
    direction: "row",
    first: "submission",
    second: "codeTest",
    splitPercentage: 100,
  },
  splitPercentage: 60,
};
export const editor: MosaicNode<string> = {
  direction: "column",
  first: "editor",
  second: {
    direction: "row",
    first: "submission",
    second: "codeTest",
    splitPercentage: 50,
  },
  splitPercentage: 100,
};
export const codeTest: MosaicNode<string> = {
  direction: "column",
  first: "editor",
  second: {
    direction: "row",
    first: "submission",
    second: "codeTest",
    splitPercentage: 0,
  },
  splitPercentage: 60,
};

export const submission: MosaicNode<string> = {
  direction: "column",
  first: "editor",
  second: {
    direction: "row",
    first: "submission",
    second: "codeTest",
    splitPercentage: 100,
  },
  splitPercentage: 60,
};
