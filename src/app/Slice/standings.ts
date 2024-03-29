import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ipcRendererManager } from "../../ipc";
import { AppThunk, RootState } from "../store";
// import { totalfn } from "../logic/standingTotal";
//自分の順位、未取得または何らかの理由で取得できない場合はundefined
type myrank = any | undefined;
//順位表を集計し問題ごとの提出数・正解数を記録
type total = any;

interface initialStatetype {
  cache: boolean | undefined;
  time: number | undefined;
  data: any | undefined;
  myrank: myrank;
  total: total;
  load: boolean;
}
const initialState: initialStatetype = {
  cache: undefined,
  time: undefined,
  data: undefined,
  myrank: "リロードしてください",
  total: [],
  load: false,
};
export const standingsSlice = createSlice({
  name: "standingData",
  initialState,
  reducers: {
    //ipcからの情報をそのまま記録
    getData: (state, action: PayloadAction<any>) => {
      state.cache = action.payload.cache;
      state.time = action.payload.time;
      state.data = action.payload.data;
    },
    //非同期で順位表から自分の順位を取得
    setRank: (state, action: PayloadAction<myrank>) => {
      state.myrank = action.payload;
    },
    //非同期で順位表を集計し自分の順位を取得
    setTotal: (state, action: PayloadAction<myrank>) => {
      state.total = action.payload;
    },
    loadStart: (state) => {
      state.load = true;
    },
    loadEnd: (state) => {
      state.load = false;
    },
  },
});
export const { getData, setRank, setTotal, loadStart, loadEnd } =
  standingsSlice.actions;

export const sendGetmyrank = (): AppThunk => async (dispatch, getState) => {
  if (getState().standingData.load === false) {
    ipcRendererManager.invoke("GET_RANK").then((myrank) => {
      dispatch(setRank(myrank));
      ipcRendererManager.invoke("GET_TOTAL").then((total) => {
        dispatch(setTotal(total));
        dispatch(loadEnd);
      });
    });
    //ipc受信部
  } else {
    console.log("nowloading");
  }
};

export const selectStandings = (state: RootState) => state.standingData.data;
export const selectMyrank = (state: RootState) => {
  return state.standingData.myrank;
};
export const selectUpdateTime = (state: RootState) => {
  return state.standingData.time;
};
export const selectTotal = (state: RootState) => {
  return state.standingData.total;
};
export default standingsSlice.reducer;
