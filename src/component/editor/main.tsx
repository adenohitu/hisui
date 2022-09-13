import { Mosaic, MosaicNode } from "react-mosaic-component";
import "react-mosaic-component/react-mosaic-component.css";
import { Editorwindow } from "./window_editor/editorwindow";
import SpeedDials from "./tool/floatingbutton";
import { CustomTestWindow } from "../codetest/run-window";
import { SettingAppDialog } from "./setting-window/system-setting";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./mosaic-style.css";
import { Box } from "@mui/system";
import { monacoElement, useMosaicState } from "../mosaic/mosaic-hooks";
import {
  NowSelectTaskSelectList,
  TaskSelectList,
} from "./tool/selecter/select-tree";
const ELEMENT_MAP: monacoElement = {
  TaskSelect: {
    component: (
      <Box>
        <TaskSelectList />
      </Box>
    ),
  },
  NowTaskSelect: {
    component: (
      <Box>
        <NowSelectTaskSelectList />
      </Box>
    ),
  },
  EditorMain: {
    component: (
      <div>
        <Editorwindow />
      </div>
    ),
  },
};
const defaultState: MosaicNode<string> = {
  direction: "row",
  first: {
    direction: "column",
    first: "TaskSelect",
    second: "NowTaskSelect",
    splitPercentage: 70,
  },
  second: "EditorMain",
  splitPercentage: 15,
};
export const Editor = () => {
  // const classes = useStyles();
  const mosaicHook = useMosaicState(
    "editor_parent_new1",
    ELEMENT_MAP,
    defaultState
  );
  return (
    <>
      <div
        className="editor-parent"
        style={{
          boxSizing: "border-box",
          height: "100%",
          width: "100%",
        }}
      >
        <SettingAppDialog />
        <CustomTestWindow />
        <Mosaic<string>
          renderTile={(id) => ELEMENT_MAP[id].component}
          resize={{ minimumPaneSizePercentage: 16 }}
          onChange={mosaicHook.onChange}
          onRelease={mosaicHook.onRelease}
          value={mosaicHook.windowState}
        />
        <SpeedDials />
      </div>
    </>
  );
};
