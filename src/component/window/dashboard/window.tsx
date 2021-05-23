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
import { useDispatch } from "react-redux";
import { sendGetmyrank } from "../../../app/Slice/standings";
import { sendGetTasklist } from "../../../app/Slice/taskdata";
import { requestScoreAsync } from "../../../app/Slice/score";
import { sendGetmysubmission } from "../../../app/Slice/submissions";
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
  const dispatch = useDispatch();
  // dashboardapiからの更新イベントを受け取る
  useEffect(() => {
    const updateStanding_event = async () => {
      // 順位表更新
      dispatch(sendGetmyrank());
      // 問題情報を更新
      dispatch(sendGetTasklist());
      // スコアデータを更新
      dispatch(requestScoreAsync());
      // 提出情報を更新
      dispatch(sendGetmysubmission());
    };
    window.api.updateDashboard(updateStanding_event);
  }, [dispatch]);
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
