import { Box } from "@material-ui/core";
import { Mosaic } from "react-mosaic-component";
import "react-mosaic-component/react-mosaic-component.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./style.css";
import { TaskSelect } from "../editor/tool/selecttask";
import { Submitconsole } from "./submitconsole";

// const useStyles = makeStyles({});
const ELEMENT_MAP: { [viewId: string]: JSX.Element } = {
  a: (
    <Box>
      <TaskSelect />
    </Box>
  ),
  b: (
    <div>
      <Submitconsole />
    </div>
  ),
};

export const Submitmain = () => {
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
