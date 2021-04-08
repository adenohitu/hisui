import React, { useState, useEffect } from "react";
import { Mosaic, MosaicWindow, MosaicNode } from "react-mosaic-component";
// import { Classes } from "@blueprintjs/core";
import "react-mosaic-component/react-mosaic-component.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
// import Clock from "../component/clock/Clock";
import { TITLE_ELEMENT } from "./load_window";
import { dashboadWindowState } from "./dafaltwindowState";
import { setValue, getValue, setResetOn } from "./stateControle";

// import classNames from "classnames";

import "./style.css";
export let [windowState, setState]: any = "";
const theme: string = "mosaic-blueprint-theme";
export default function DefaltContest() {
  [windowState, setState] = useState(dashboadWindowState);
  const onChange = (currentNode: MosaicNode<string> | null) => {
    // console.log(currentNode);
    setState(currentNode);
  };

  //保存されているものを読み出す
  async function value() {
    console.log("value start");
    const data: any = await getValue();
    console.log("value end");
    setState(data);
  }
  const onRelease = (currentNode: MosaicNode<string> | null) => {
    setValue(currentNode);
  };
  useEffect(() => {
    value();
    setResetOn();
  }, []);
  return (
    <div className="react-mosaic-app">
      <Mosaic<string>
        className={theme}
        renderTile={(id, path) => (
          <MosaicWindow<string>
            path={path}
            title={TITLE_ELEMENT[id].name}
            className="table-window"
          >
            {TITLE_ELEMENT[id].component}
          </MosaicWindow>
        )}
        onChange={onChange}
        onRelease={onRelease}
        value={windowState}
      />
    </div>
  );
}
