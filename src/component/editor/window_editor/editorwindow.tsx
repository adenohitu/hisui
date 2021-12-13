import { Mosaic, MosaicNode, MosaicWindow } from "react-mosaic-component";

// import { EditorTool } from "../tool/editortool";
import React, { useState } from "react";
import {
  codeTest,
  editor,
  editorWindowMosaicKey,
  initial,
  submission,
} from "./default";
import { TITLE_ELEMENT } from "./default";
import { useAppStatus } from "../tool/statusbar/status-hooks";

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
  const appstatusHooks = useAppStatus();
  return (
    <>
      <Mosaic<editorWindowMosaicKey>
        renderTile={(id, path) => (
          <MosaicWindow<editorWindowMosaicKey>
            path={path}
            title={
              (TITLE_ELEMENT[id].name === "code" &&
                `${appstatusHooks.contestName}-${appstatusHooks.taskname}`) ||
              TITLE_ELEMENT[id].name
            }
            toolbarControls={TITLE_ELEMENT[id].toolbarControls}
            className="table-window"
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
