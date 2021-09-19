//スコアデータを管理
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ipcRendererManager } from "../../ipc";
import { AppThunk, RootState } from "../store";

interface scoreData {
  scoreData: any;
  //ロード中はtrue
  load: boolean;
}
const initialState: scoreData = {
  scoreData: [],
  load: false,
};

export const scoreDataSlice = createSlice({
  name: "scoreData",
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setdata: (state, action: PayloadAction<any>) => {
      state.scoreData = action.payload;
    },
    loadStart: (state) => {
      state.load = true;
    },
    loadEnd: (state) => {
      state.load = false;
    },
  },
});
export const { setdata, loadStart, loadEnd } = scoreDataSlice.actions;
export const requestScoreAsync = (): AppThunk => async (dispatch, getState) => {
  const update = async () => {
    const check: boolean = await ipcRendererManager.invoke("GET_LOGIN_STATUS");
    if (check && getState().scoreData.load === false) {
      dispatch(loadStart());
      const getDataipc = async () => {
        const data = await window.api.get_Score_render();
        return data;
      };
      performance.mark("start_get_score");
      const returndata = await getDataipc();
      dispatch(setdata(returndata));
      dispatch(loadEnd());
      performance.mark("end_get_score");
    } else {
      dispatch(setdata([]));
    }
  };
  update();
};

export const selectscoreData = (state: RootState) => {
  return state.scoreData.scoreData;
};
export const selectload = (state: RootState) => {
  return state.scoreData.load;
};
export default scoreDataSlice.reducer;
