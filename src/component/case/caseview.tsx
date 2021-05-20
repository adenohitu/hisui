import { Box, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { layoutstate } from "./casecont";
import "./caseview.css";

export function CaseView() {
  const [state, setstate] = useState<layoutstate[]>([
    { i: "a", x: 0, y: 0, w: 1, h: 1 },
    { i: "b", x: 0, y: 1, w: 4, h: 1 },
  ]);
  function onLayoutChange(layout: Layout[]) {
    // setstate(layout);
  }
  return (
    <>
      <GridLayout
        layout={state}
        className="layout"
        onLayoutChange={onLayoutChange}
        cols={6}
        rowHeight={100}
        width={600}
      >
        {state.map((ele) => {
          return <div key={ele.i} style={{ backgroundColor: ele.color }}></div>;
        })}
      </GridLayout>
    </>
  );
}
