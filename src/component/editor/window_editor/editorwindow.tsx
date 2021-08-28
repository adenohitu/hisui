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
