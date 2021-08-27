import { Mosaic, MosaicNode, MosaicWindow } from "react-mosaic-component";
import { MainEditor } from "../editor";
import { ReloadButton, SubmissionTable } from "../../submission/submission";
// import { EditorTool } from "../tool/editortool";
import React, { useState } from "react";
import { CodeTestWindow } from "../codetest";

type editorWindowMosaicKey = keyof typeof TITLE_ELEMENT;
const initial: MosaicNode<editorWindowMosaicKey> = {
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
const editor: MosaicNode<editorWindowMosaicKey> = {
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
const codeTest: MosaicNode<editorWindowMosaicKey> = {
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
const submission: MosaicNode<editorWindowMosaicKey> = {
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

export let focusEditor: () => void | undefined;
export let focuscodeTest: () => void | undefined;
export let focussubmission: () => void | undefined;
export const Editorwindow = () => {
  const [windowState, setState] =
    useState<MosaicNode<editorWindowMosaicKey> | null>(initial);
  const onChange = (windowState: MosaicNode<editorWindowMosaicKey> | null) => {
    // console.log(windowState);
    setState(windowState);
  };
  focusEditor = () => {
    setState(editor);
  };
  focuscodeTest = () => {
    setState(codeTest);
  };
  focussubmission = () => {
    setState(submission);
  };
  const onRelease = (windowState: MosaicNode<editorWindowMosaicKey> | null) => {
    // setState(windowState);
  };
  return (
    <>
      <Mosaic<editorWindowMosaicKey>
        renderTile={(id, path) => (
          <MosaicWindow<editorWindowMosaicKey>
            path={path}
            title={TITLE_ELEMENT[id].name}
            toolbarControls={[]}
            className="table-window"
            additionalControls={TITLE_ELEMENT[id].additionalControl}
            additionalControlButtonText="操作"
          >
            {TITLE_ELEMENT[id].component}
          </MosaicWindow>
        )}
        resize={{ minimumPaneSizePercentage: 0 }}
        onChange={onChange}
        onRelease={onRelease}
        value={windowState}
      />
    </>
  );
};
