//問題情報を管理
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { taskList } from "../../../src_main/data/scraping/tasklist";
import { ipcRendererManager } from "../../ipc";
import { AppThunk, RootState } from "../store";

interface taskData {
  nowTop: number | false;
  taskData: taskList[];
  //ロード中はtrue
  load: boolean;
}
const initialState: taskData = {
  nowTop: false,
  taskData: [],
  load: false,
};

export const taskDataSlice = createSlice({
  name: "taskData",
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setdata: (state, action: PayloadAction<any>) => {
      state.taskData = action.payload;
    },
    setNowTop: (state, action: PayloadAction<any>) => {
      state.nowTop = action.payload;
    },
    loadStart: (state) => {
      state.load = true;
    },
    loadEnd: (state) => {
      state.load = false;
    },
  },
});
export const { setdata, setNowTop, loadStart, loadEnd } = taskDataSlice.actions;
export const sendGetTasklist = (): AppThunk => async (dispatch, getState) => {
  if (getState().submissionsData.load === false) {
    dispatch(loadStart());
    ipcRendererManager.invoke("GET_TASK_LIST").then((data) => {
      if (data !== "reqError") {
        dispatch(setdata(data));
        dispatch(loadEnd());
      } else {
        dispatch(loadEnd());
      }
    });

    //ipc受信部
  } else {
    console.log("nowloading");
  }
};
/**
 * 選択されているAssignmentNameを保持
 */
export const changeNowtop =
  (AssignmentName: number | false): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setNowTop(AssignmentName));
  };

export const selecttaskData = (state: RootState) => {
  return state.taskData.taskData;
};
export const selectNowtop = (state: RootState) => {
  return state.taskData.nowTop;
};
export const selectload = (state: RootState) => {
  return state.taskData.load;
};
export default taskDataSlice.reducer;
