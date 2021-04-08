// import { Component } from "React";
import { useWindowSize } from "./WindowSize";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
// import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./test.css";
export const MyFirstGrid = () => {
  const size = useWindowSize();
  // const layout = [
  //   { i: "a", x: 0, y: 0, w: 1, h: 2, static: true },
  //   { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
  //   { i: "c", x: 4, y: 0, w: 1, h: 2 },
  // ];
  return (
    <ResponsiveGridLayout
      className="layout"
      // layout={layout}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      width={size.width}
    >
      <div key="a">a</div>
      <div key="b">b</div>
      <div key="c">c</div>
    </ResponsiveGridLayout>
  );
};
