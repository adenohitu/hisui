import { useState } from "react";
import { Mosaic, MosaicWindow } from "react-mosaic-component";
import { MainEditor } from "../../editor/editor";
import { Taskview } from "../../taskview/taskview";
// import "react-mosaic-component/react-mosaic-component.css";
// import "@blueprintjs/core/lib/css/blueprint.css";
// import "@blueprintjs/icons/lib/css/blueprint-icons.css";

// import "./style.css";

export const TITLE_ELEMENT: {
  [viewId: string]: { name: string; component: any };
} = {
  time: { name: "コード", component: () => <MainEditor /> },
  time2: { name: "問題", component: (hide?: any) => <Taskview hide={hide} /> },
};

export const Editorwindow = () => {
  const [change, setchange] = useState(false);
  return (
    <Mosaic<string>
      onChange={() => {
        setchange(true);
      }}
      onRelease={() => {
        setchange(false);
      }}
      renderTile={(id, path) => (
        <MosaicWindow<string>
          path={path}
          title={TITLE_ELEMENT[id].name}
          className="table-window"
        >
          {TITLE_ELEMENT[id].component(change)}
        </MosaicWindow>
      )}
      initialValue={{
        direction: "row",
        first: "time",
        second: "time2",
      }}
    />
  );
};
