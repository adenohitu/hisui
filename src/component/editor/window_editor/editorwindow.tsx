import { Mosaic, MosaicWindow } from "react-mosaic-component";

import { codeTest, editor, initial, submission } from "./default";
import { TITLE_ELEMENT } from "./default";
import { useAppStatus } from "../tool/statusbar/status-hooks";
import { useMosaicState } from "../../mosaic/mosaic-hooks";

export let focusEditor: () => void | undefined;
export let focuscodeTest: () => void | undefined;
export let focussubmission: () => void | undefined;
export const Editorwindow = () => {
  const appstatusHooks = useAppStatus();
  const mosaicHook = useMosaicState("editor_main", TITLE_ELEMENT, initial);
  focusEditor = () => {
    mosaicHook.setState(editor);
  };
  focuscodeTest = () => {
    mosaicHook.setState(codeTest);
  };

  focussubmission = () => {
    mosaicHook.setState(submission);
  };

  return (
    <>
      <Mosaic<string>
        renderTile={(id, path) => (
          <MosaicWindow<string>
            path={path}
            title={
              (TITLE_ELEMENT[id].name === "code" &&
                `${appstatusHooks.taskScreenName
                  .toUpperCase()
                  .replaceAll("_", "-")}`) ||
              "" ||
              String(TITLE_ELEMENT[id].name)
            }
            toolbarControls={TITLE_ELEMENT[id].toolbarControls}
            className="table-window"
          >
            {TITLE_ELEMENT[id].component}
          </MosaicWindow>
        )}
        resize={{ minimumPaneSizePercentage: 0 }}
        onChange={mosaicHook.onChange}
        onRelease={mosaicHook.onRelease}
        value={mosaicHook.windowState}
      />
    </>
  );
};
