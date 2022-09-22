import React from "react";
import { CodeTestWindow } from "../../codetest/codetest-status";
import { MainEditor } from "../editor";
import { MosaicNode } from "react-mosaic-component";
import { OpenSettingTool } from "../setting-window/system-setting";
import { monacoElement } from "../../mosaic/mosaic-hooks";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ipcRendererManager } from "../../../ipc";
import { focussubmission } from "./editorwindow";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { customTestWindowOpen } from "../../codetest/run-window";
import {
  ReloadButtonTool,
  SubmissionsTable,
} from "../../submission/submissions";
const SendButton = () => {
  return (
    <IconButton
      size="small"
      aria-label={"Submit"}
      onClick={() => {
        ipcRendererManager.send("RUN_SUBMIT_NOWTOP");
        focussubmission();
      }}
    >
      <SendIcon />
    </IconButton>
  );
};
const CodeTestButton = () => {
  return (
    <IconButton
      size="small"
      aria-label={"Submit"}
      onClick={() => {
        if (customTestWindowOpen) customTestWindowOpen();
      }}
    >
      <PlaylistAddCheckIcon />
    </IconButton>
  );
};
export const TITLE_ELEMENT: monacoElement = {
  editor: {
    name: "code",
    component: <MainEditor />,
    toolbarControls: React.Children.toArray([
      <SendButton />,
      <CodeTestButton />,
      <OpenSettingTool />,
    ]),
  },
  submission: {
    name: "提出一覧",
    component: <SubmissionsTable />,
    toolbarControls: React.Children.toArray([<ReloadButtonTool />]),
  },
  codeTest: {
    name: "テスト結果:AtCoderCustomTest",
    component: <CodeTestWindow />,
    toolbarControls: [],
  },
};
export const initial: MosaicNode<string> = {
  direction: "column",
  first: "editor",
  second: {
    direction: "row",
    first: "submission",
    second: "codeTest",
    splitPercentage: 100,
  },
  splitPercentage: 60,
};
export const editor: MosaicNode<string> = {
  direction: "column",
  first: "editor",
  second: {
    direction: "row",
    first: "submission",
    second: "codeTest",
    splitPercentage: 50,
  },
  splitPercentage: 100,
};
export const codeTest: MosaicNode<string> = {
  direction: "column",
  first: "editor",
  second: {
    direction: "row",
    first: "submission",
    second: "codeTest",
    splitPercentage: 0,
  },
  splitPercentage: 60,
};

export const submission: MosaicNode<string> = {
  direction: "column",
  first: "editor",
  second: {
    direction: "row",
    first: "submission",
    second: "codeTest",
    splitPercentage: 100,
  },
  splitPercentage: 60,
};
