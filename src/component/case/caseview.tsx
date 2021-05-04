import { Box, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./caseview.css";

export function CaseView() {
  const [item, setitem] = useState(<></>);
  function Adddiv(tmp = 1) {
    if (tmp === 1) {
      setitem(
        <GridLayout className="layout" cols={6} rowHeight={100} width={600}>
          <div
            style={{ backgroundColor: "#555" }}
            key="a"
            data-grid={{ x: 0, y: 0, w: 1, h: 1 }}
          >
            a
          </div>
        </GridLayout>
      );
    } else {
      setitem(
        <GridLayout className="layout" cols={6} rowHeight={100} width={600}>
          <div
            style={{ backgroundColor: "#a3b1ff" }}
            key="a"
            data-grid={{ x: 0, y: 0, w: 1, h: 1 }}
          >
            <Box textAlign="center" pt={1} fontSize="h6.fontSize">
              {"1<"}
              <Typography variant="h6" style={{ color: "#121858" }}>
                N
              </Typography>
              {"<10^6"}
            </Box>
          </div>
          <div
            style={{ backgroundColor: "#d6ffa6" }}
            key="b"
            data-grid={{ x: 0, y: 1, w: 4, h: 1 }}
          >
            <Box textAlign="center" pt={4} fontSize="h6.fontSize">
              {"A1 A2 A3...AN"}
            </Box>
          </div>
        </GridLayout>
      );
    }
  }
  useEffect(() => {
    Adddiv(2);
  }, []);
  return (
    <>
      {/* <button onClick={() => Adddiv()}>test</button>
      <button onClick={() => Adddiv(3)}>test2</button> */}
      {item}
    </>
  );
}
