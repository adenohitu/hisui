import { dropRight } from "lodash";
import { useEffect, useState } from "react";
import {
  MosaicNode,
  Corner,
  getPathToCorner,
  getNodeAtPath,
  MosaicParent,
  MosaicDirection,
  getOtherDirection,
  updateTree,
} from "react-mosaic-component";
import { mosaicStateFormat } from "../../../src_main/save/utility/renderState";
import { ipcRendererManager } from "../../ipc";

export interface monacoElement {
  [viewId: string]: {
    name?: string;
    component: JSX.Element;
    toolbarControls?:
      | (React.ReactChild | React.ReactFragment | React.ReactPortal)[];
  };
}
/**
 * MOna
 * @param mosaicWindowID
 * 状態を保存するために必要な固有のID
 * @param TITLE_ELEMENT
 */
export const useMosaicState = (
  mosaicWindowID: string,
  TITLE_ELEMENT: monacoElement,
  defaultWindowState: MosaicNode<string>
) => {
  const [windowState, setState] = useState<MosaicNode<string> | null>(
    defaultWindowState
  );
  function saveStoreState(value: MosaicNode<string> | null) {
    console.log("Saved:mosaic");
    ipcRendererManager.invoke("SAVE_MOSAIC_WINDOW_STATE", {
      mosaicWindowID,
      elementViewIdList: Object.keys(TITLE_ELEMENT),
      saveState: value,
    });
  }
  // setupと初期化信号の受け取り
  useEffect(() => {
    const setup = () => {
      console.log(`mosaicHookSetup${mosaicWindowID}`);
      ipcRendererManager
        .invoke("GET_MOSAIC_WINDOW_STATE", mosaicWindowID)
        .then((result: mosaicStateFormat) => {
          if (result) {
            setState(result.saveState);
          }
        });
    };
    setup();
  }, [mosaicWindowID, defaultWindowState]);
  /**
   * 削除されたMosaicWindowをもう一度表示させる
   */
  // function addWindow(windowName: string) {}
  const reRenderWindow = (windowName: string) => {
    let currentNode = windowState;
    if (currentNode) {
      const path = getPathToCorner(currentNode, Corner.TOP_RIGHT);
      const parent = getNodeAtPath(
        currentNode,
        dropRight(path)
      ) as MosaicParent<string>;
      const destination = getNodeAtPath(
        currentNode,
        path
      ) as MosaicNode<string>;
      const direction: MosaicDirection = parent
        ? getOtherDirection(parent.direction)
        : "row";

      let first: MosaicNode<string>;
      let second: MosaicNode<string>;
      if (direction === "row") {
        first = destination;
        second = windowName;
      } else {
        first = windowName;
        second = destination;
      }

      currentNode = updateTree(currentNode, [
        {
          path,
          spec: {
            $set: {
              direction,
              first,
              second,
            },
          },
        },
      ]);
    } else {
      currentNode = windowName;
    }

    setState(currentNode);
    saveStoreState(currentNode);
  };

  const onChange = (_windowState: MosaicNode<string> | null) => {
    // console.log(windowState);
    setState(_windowState);
  };
  const onRelease = (_windowState: MosaicNode<string> | null) => {
    setState(_windowState);
    saveStoreState(_windowState);
  };
  const resetDefaultState = () => {
    setState(defaultWindowState);
    saveStoreState(defaultWindowState);
  };
  return {
    windowState,
    reRenderWindow,
    onChange,
    onRelease,
    resetDefaultState,
  };
};
