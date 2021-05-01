import { Mosaic } from "react-mosaic-component";
import { TaskSelect } from "../selecttask";
// import { MainEditor } from "../../editor/editor";
import "react-mosaic-component/react-mosaic-component.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
// import { EditorToolbar } from "../../editor/toolbar";
import { Editorwindow } from "./editorwindow";
import "./style.css";
import { Box } from "@material-ui/core";

// const useStyles = makeStyles({});
const ELEMENT_MAP: { [viewId: string]: JSX.Element } = {
  a: (
    <Box pr={1} py={0.7}>
      <TaskSelect />
    </Box>
  ),
  b: (
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
        <Mosaic<string>
          renderTile={(id) => ELEMENT_MAP[id]}
          resize={{ minimumPaneSizePercentage: 0 }}
          initialValue={{
            direction: "row",
            first: "a",
            second: "b",
            splitPercentage: 13,
          }}
        />
      </div>
    </>
  );
};
