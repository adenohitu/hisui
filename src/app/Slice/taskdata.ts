//問題情報を管理
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store";

interface taskData {
  taskData: any;
  //ロード中はtrue
  load: boolean;
}
const initialState: taskData = {
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
    loadStart: (state) => {
      state.load = true;
    },
    loadEnd: (state) => {
      state.load = false;
    },
  },
});
export const { setdata, loadStart, loadEnd } = taskDataSlice.actions;
export const sendGetTasklist = (): AppThunk => async (dispatch, getState) => {
  if (getState().submissionsData.load === false) {
    await window.api.getTasklist_on_render((arg: any) => {
      if (arg !== "reqError") {
        dispatch(setdata(arg));
      } else dispatch(loadEnd);
    });
    window.api.getTasklist_send_render();
    dispatch(loadStart);
    //ipc受信部
  } else {
    console.log("nowloading");
  }
};

export const selecttaskData = (state: RootState) => {
  return state.taskData.taskData;
};
export const selectload = (state: RootState) => {
  return state.taskData.load;
};
export default taskDataSlice.reducer;
