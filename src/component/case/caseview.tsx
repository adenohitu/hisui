import { Box, Typography } from "@material-ui/core";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import "react-resizable/css/styles.css";
import {
  addElement,
  changeLayout,
  viewStateLoad,
  elementStatusLoad,
} from "../../app/Slice/casecont";
// import { layoutstate } from "./casecont";
import "./caseview.css";
export function signChangeFont(value: string) {
  if (value === "<=") {
    return "≤";
  } else if (value === "<") {
    return "<";
  }
}
export function CaseView() {
  const dispatch = useDispatch();
  // const [state, setstate] = useState<layoutstate[]>([
  //   { i: "a", x: 0, y: 0, w: 1, h: 1 },
  //   { i: "b", x: 0, y: 1, w: 4, h: 1 },
  // ]);
  const state = useSelector(viewStateLoad);
  const elementstatus = useSelector(elementStatusLoad);
  function onLayoutChange(layout: Layout[]) {
    dispatch(changeLayout(layout));
  }
  return (
    <>
      <button
        onClick={() => {
          // dispatch(addElement("a", 1, "1<a<5"));
        }}
      >
        test
      </button>
      <GridLayout
        layout={state}
        className="layout"
        onLayoutChange={onLayoutChange}
        cols={6}
        rowHeight={100}
        width={600}
      >
        {state.map((ele) => {
          const status = elementstatus[ele.i];
          return (
            <div key={ele.i} style={{ backgroundColor: "#eee" }}>
              <Box textAlign="center" pt={1} fontSize="h6.fontSize">
                {status.min}
                {signChangeFont(status.leftsign)}
                <Typography variant="h6" style={{ color: "#121858" }}>
                  {ele.i}
                </Typography>
                {signChangeFont(status.rightsign)}
                {status.max}
              </Box>
            </div>
          );
        })}
      </GridLayout>
    </>
  );
}
