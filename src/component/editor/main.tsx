import { Mosaic } from "react-mosaic-component";
import { TaskSelect } from "./tool/selecttask";
import "react-mosaic-component/react-mosaic-component.css";
import { Editorwindow } from "./window_editor/editorwindow";
import { Box } from "@mui/material";
import SpeedDials from "./tool/floatingbutton";
import { CustomTestWindow } from "../codetest/run-window";
import { SettingAppDialog } from "../setting/system-setting";
import { StatusBar } from "./tool/statusbar/status-bar";

// const useStyles = makeStyles({});
const ELEMENT_MAP: { [viewId: string]: JSX.Element } = {
  TaskSelect: (
    <Box pr={1} py={0.7}>
      <TaskSelect />
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
        style={{ margin: 0, paddingBottom: 22, height: "100%", width: "100%" }}
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
