import { useEffect } from "react";
import { Mosaic, MosaicWindow } from "react-mosaic-component";
import "react-mosaic-component/react-mosaic-component.css";
import { TITLE_ELEMENT } from "./load_window";
import { dashboadWindowState } from "./dafaltwindowState";
import { useDispatch } from "react-redux";
import { sendGetmyrank } from "../../app/Slice/standings";
import { sendGetTasklist } from "../../app/Slice/taskdata";
import { requestScoreAsync } from "../../app/Slice/score";
import { ipcRendererManager } from "../../ipc";
import { useMosaicState } from "../mosaic/mosaic-hooks";
import { DashboaedSpeedDial } from "./reset-button";
const theme: string = "mosaic-blueprint-theme react-mosaic-app";

export default function DefaltContest() {
  const mosaicHook = useMosaicState(
    "dashboard",
    TITLE_ELEMENT,
    dashboadWindowState
  );
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
    };
    ipcRendererManager.on("LISTENER_UPDATE_DASHBOARD", updateStanding_event);
  }, [dispatch]);
  return (
    <>
      {/* <button
        onClick={() => {
          mosaicHook.resetDefaultState();
        }}
      >
        Reset
      </button> */}
      <DashboaedSpeedDial windowReset={mosaicHook.resetDefaultState} />
      <Mosaic<string>
        className={theme}
        renderTile={(id, path) => (
          <MosaicWindow<string>
            toolbarControls={TITLE_ELEMENT[id].toolbarControls}
            path={path}
            title={TITLE_ELEMENT[id].name}
            className="table-window"
          >
            {TITLE_ELEMENT[id].component}
          </MosaicWindow>
        )}
        onChange={mosaicHook.onChange}
        onRelease={mosaicHook.onRelease}
        value={mosaicHook.windowState}
      />
    </>
  );
}
