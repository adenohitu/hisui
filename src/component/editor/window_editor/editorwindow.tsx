// import { useState } from "react";
import { Mosaic, MosaicWindow } from "react-mosaic-component";
import { MainEditor } from "../editor";
// import { Taskview } from "../../taskview/taskview";
import { SubmissionTable } from "../../submission/submission";
import { Judgetool } from "../../submit/judge";

// import "react-mosaic-component/react-mosaic-component.css";
// import "@blueprintjs/core/lib/css/blueprint.css";
// import "@blueprintjs/icons/lib/css/blueprint-icons.css";

// import "./style.css";

export const TITLE_ELEMENT: {
  [viewId: string]: { name: string; component: any };
} = {
  editor: { name: "コード", component: <MainEditor /> },
  submission: { name: "提出一覧", component: <SubmissionTable /> },
  tool: { name: "ツール", component: <Judgetool /> },
};

export const Editorwindow = () => {
  // const [change, setchange] = useState(false);
  return (
    <>
      <Mosaic<string>
        // onChange={() => {
        //   setchange(true);
        // }}
        // onRelease={() => {
        //   setchange(false);
        // }}
        renderTile={(id, path) => (
          <MosaicWindow<string>
            path={path}
            title={TITLE_ELEMENT[id].name}
            className="table-window"
          >
            {TITLE_ELEMENT[id].component}
          </MosaicWindow>
        )}
        resize={{ minimumPaneSizePercentage: 0 }}
        initialValue={{
          direction: "row",
          first: "editor",
          second: {
            direction: "column",
            first: "submission",
            second: "tool",
          },
        }}
      />
    </>
  );
};
