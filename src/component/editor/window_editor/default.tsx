import React from "react";
import { CodeTestWindow } from "../../codetest/codetest";
import { MainEditor } from "../editor";
import { ReloadButton, SubmissionTable } from "../../submission/submission";
import { MosaicNode } from "react-mosaic-component";
export const TITLE_ELEMENT = {
  editor: {
    name: "コード",
    component: <MainEditor />,
    additionalControl: undefined,
  },
  submission: {
    name: "提出一覧",
    component: <SubmissionTable />,
    additionalControl: React.Children.toArray([<ReloadButton />]),
  },

  codeTest: {
    name: "テスト結果:AtCoderCustomTest",
    component: <CodeTestWindow />,
    additionalControl: undefined,
  },
};
export type editorWindowMosaicKey = keyof typeof TITLE_ELEMENT;
export const initial: MosaicNode<editorWindowMosaicKey> = {
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
export const editor: MosaicNode<editorWindowMosaicKey> = {
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
export const codeTest: MosaicNode<editorWindowMosaicKey> = {
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

export const submission: MosaicNode<editorWindowMosaicKey> = {
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
