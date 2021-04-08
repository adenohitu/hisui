//コンテスト情報を管理
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store";

interface contestData {
  contestData: any;
  //ロード中はtrue
  load: boolean;
}
const initialState: contestData = {
  contestData: [],
  load: false,
};

export const contestDataSlice = createSlice({
  name: "contestData",
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setdata: (state, action: PayloadAction<any>) => {
      state.contestData = action.payload;
    },
    loadStart: (state) => {
      state.load = true;
    },
    loadEnd: (state) => {
      state.load = false;
    },
  },
});
export const { setdata, loadStart, loadEnd } = contestDataSlice.actions;
export const requestContestDataAsync = (): AppThunk => async (
  dispatch,
  getState
) => {
  const update = async () => {
    const check: boolean = await window.api.get_login_status_render();
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
export default contestDataSlice.reducer;
