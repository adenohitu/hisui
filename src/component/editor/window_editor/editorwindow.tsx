import { Mosaic, MosaicWindow } from "react-mosaic-component";
import { MainEditor } from "../editor";
import { ReloadButton, SubmissionTable } from "../../submission/submission";
// import { EditorTool } from "../tool/editortool";
import React from "react";
import { CodeTestWindow } from "../codetest";

type editorWindowMosaicKey = keyof typeof TITLE_ELEMENT;

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
export const Editorwindow = () => {
  return (
    <>
      <Mosaic<editorWindowMosaicKey>
        renderTile={(id, path) => (
          <MosaicWindow<editorWindowMosaicKey>
            path={path}
            title={TITLE_ELEMENT[id].name}
            className="table-window"
            additionalControls={TITLE_ELEMENT[id].additionalControl}
            additionalControlButtonText="操作"
          >
            {TITLE_ELEMENT[id].component}
          </MosaicWindow>
        )}
        resize={{ minimumPaneSizePercentage: 0 }}
        initialValue={{
          direction: "column",
          first: "editor",
          second: {
            direction: "row",
            first: "submission",
            second: "codeTest",
            splitPercentage: 0,
          },
          splitPercentage: 50,
        }}
      />
    </>
  );
};
