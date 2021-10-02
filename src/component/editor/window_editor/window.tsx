import { Mosaic } from "react-mosaic-component";
import { TaskSelect } from "../tool/selecttask";
import "react-mosaic-component/react-mosaic-component.css";
import { Editorwindow } from "./editorwindow";
import { Box } from "@mui/material";
import SpeedDials from "../tool/floatingbutton";
import TestTool from "../../codetest/rundialog";
import { CustomTestWindow } from "../../codetest/run-window";

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
      <div className="react-mosaic-app">
        <TestTool />
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
    </>
  );
};
