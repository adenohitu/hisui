import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ipcRendererManager } from "../../ipc";
import { AppThunk, RootState } from "../store";

interface initialStatetype {
  data: any;
  load: boolean;
}
const initialState: initialStatetype = {
  data: [],
  load: false,
};
export const submissionsSlice = createSlice({
  name: "submissionsData",
  initialState,
  reducers: {
    //ipcからの情報をそのまま記録
    getData: (state, action: PayloadAction<any>) => {
      console.log(action.payload);
      state.data = action.payload;
    },
    loadStart: (state) => {
      state.load = true;
    },
    loadEnd: (state) => {
      state.load = false;
    },
  },
});
export const { getData, loadStart, loadEnd } = submissionsSlice.actions;

export const sendGetmysubmission =
  (): AppThunk => async (dispatch, getState) => {
    if (getState().submissionsData.load === false) {
      dispatch(loadStart);
      ipcRendererManager.invoke("GET_MY_SUBMISSIONS").then((arg) => {
        dispatch(getData(arg));
        dispatch(loadEnd);
      });
      //ipc受信部
    } else {
      console.log("nowloading");
    }
  };

export const selectSubmissions = (state: RootState) =>
  state.submissionsData.data;

export default submissionsSlice.reducer;
