import { Mosaic, MosaicWindow } from "react-mosaic-component";
import { MainEditor } from "../editor";
import { ReloadButton, SubmissionTable } from "../../submission/submission";
import { EditorTool } from "../tool/editortool";
export const TITLE_ELEMENT: {
  [viewId: string]: {
    name: string;
    component: JSX.Element;
    additionalControl?: JSX.Element[];
  };
} = {
  editor: {
    name: "コード",
    component: <MainEditor />,
  },
  submission: {
    name: "提出一覧",
    component: <SubmissionTable />,
    additionalControl: [<ReloadButton />],
  },
  tool: { name: "ツール", component: <EditorTool /> },
};

export const Editorwindow = () => {
  return (
    <>
      <Mosaic<string>
        renderTile={(id, path) => (
          <MosaicWindow<string>
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
          second: "submission",
          splitPercentage: 75,
        }}
      />
    </>
  );
};
