import { Mosaic } from "react-mosaic-component";
import "react-mosaic-component/react-mosaic-component.css";
import { Editorwindow } from "./window_editor/editorwindow";
import SpeedDials from "./tool/floatingbutton";
import { CustomTestWindow } from "../codetest/run-window";
import { SettingAppDialog } from "../setting/system-setting";
import { StatusBar } from "./tool/statusbar/status-bar";
import { TaskSelectTree } from "./tool/selecter/select-tree";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./mosaic-style.css";
import { Box } from "@mui/system";
const ELEMENT_MAP: { [viewId: string]: JSX.Element } = {
  TaskSelect: (
    <Box>
      <TaskSelectTree />
    </Box>
  ),
  EditorMain: (
    <div>
      <Editorwindow />
    </div>
  ),
};

export const Editor = () => {
  // const classes = useStyles();
  return (
    <>
      <div
        style={{
          boxSizing: "border-box",
          paddingBottom: "22px",
          height: "100%",
          width: "100%",
        }}
      >
        <SettingAppDialog />
        <CustomTestWindow />
        <Mosaic<string>
          renderTile={(id) => ELEMENT_MAP[id]}
          resize={{ minimumPaneSizePercentage: 0 }}
          initialValue={{
            direction: "row",
            first: "TaskSelect",
            second: "EditorMain",
            splitPercentage: 13,
          }}
        />
        <SpeedDials />
      </div>
      <StatusBar />
    </>
  );
};
