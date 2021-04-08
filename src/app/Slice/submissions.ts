import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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

export const sendGetmysubmission = (): AppThunk => async (
  dispatch,
  getState
) => {
  if (getState().submissionsData.load === false) {
    await window.api.getSubmissions_on_render((arg: any) => {
      dispatch(getData(arg));
      dispatch(loadEnd);
    });
    // console.log("tetst");
    window.api.getSubmissions_send_render();
    dispatch(loadStart);
    //ipc受信部
  } else {
    console.log("nowloading");
  }
};

export const selectSubmissions = (state: RootState) =>
  state.submissionsData.data;

export default submissionsSlice.reducer;
