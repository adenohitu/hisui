//TaskviewとEditorの状態を管理
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store";

interface editorData {
  editorvalue: any;
  contestId: string | undefined;
  taskname: string | undefined;
  taskurl: string | undefined;
  //ロード中はtrue
  load: boolean;
}
const initialState: editorData = {
  editorvalue: "",
  contestId: undefined,
  taskname: undefined,
  taskurl: "/testpage.html",
  load: false,
};

export const editorDataSlice = createSlice({
  name: "editorData",
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    seteditorvalue: (state, action: PayloadAction<any>) => {
      state.editorvalue = action.payload;
    },
    setcontestId: (state, action: PayloadAction<any>) => {
      state.contestId = action.payload;
    },
    settaskname: (state, action: PayloadAction<any>) => {
      state.taskname = action.payload;
    },
    settaskurl: (state, action: PayloadAction<any>) => {
      state.taskurl = action.payload;
    },
    loadStart: (state) => {
      state.load = true;
    },
    loadEnd: (state) => {
      state.load = false;
    },
  },
});
export const {
  seteditorvalue,
  setcontestId,
  settaskname,
  settaskurl,
  loadStart,
  loadEnd,
} = editorDataSlice.actions;
export const loadtask = (
  contestname: string,
  taskname: string,
  taskurl: string
): AppThunk => async (dispatch, getState) => {
  dispatch(setcontestId(contestname));
  dispatch(settaskname(taskname));
  dispatch(settaskurl(taskurl));
  const data = await window.api.getFiledata_render({
    contestname,
    taskname,
    launage: "python",
  });
  dispatch(seteditorvalue(data));
};
export const saveValue = (editorvalue: any): AppThunk => async (
  dispatch,
  getState
) => {
  await window.api.runWritefile_render({
    data: editorvalue,
    contestname: getState().editorData.contestId,
    taskname: getState().editorData.taskname,
    launage: "python",
  });
  dispatch(seteditorvalue(editorvalue));
};

export const selecteditorvalue = (state: RootState) => {
  return state.editorData.editorvalue;
};
export const selecttaskurl = (state: RootState) => {
  return state.editorData.taskurl;
};
export const selectload = (state: RootState) => {
  return state.scoreData.load;
};
export default editorDataSlice.reducer;
