import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
  myrank: undefined,
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
export const {
  getData,
  setRank,
  setTotal,
  loadStart,
  loadEnd,
} = standingsSlice.actions;
// memo dispatchは2回以上つかっても大丈夫！
// export const requestStandingAsync = (): AppThunk => async (
//   dispatch,
//   getState
// ) => {
//   const update = async () => {
//     //ログイン状態とロード中かをチェック
//     const check: boolean = await window.api.get_login_status_render();
//     if (check && getState().standingData.load === false) {
//       dispatch(loadStart());
//       performance.mark("start_get_standing");
//       // //順位表を取得
//       // const returndata = await window.api.get_Standings_render();
//       // performance.mark("reqend_get_standing");
//       // dispatch(getData(returndata));
//       performance.mark("end_get_standing");
//       // console.log(
//       performance.measure(
//         "順位表取得にかかる時間",
//         "start_get_standing",
//         "end_get_standing"
//       );
//       // );
//       //自分の順位を検索
//       // const username = await window.api.getUsername_render();
//       performance.mark("start_get_myrank");
//       const myrank: myrank = await window.api.getRank_render();
//       // const myrank = 0;
//       //参加登録されていない時、順位表に存在しないためここで切り分け
//       if (myrank !== undefined) {
//         dispatch(setRank(myrank));
//         performance.mark("end_get_myrank");
//       } else {
//         dispatch(setRank(undefined));
//         performance.mark("end_get_myrank");
//       }
//       performance.measure(
//         "自分の順位の取得にかかる時間",
//         "start_get_myrank",
//         "end_get_myrank"
//       );
//       //順位表を集計
//       // const totalre = await totalfn(returndata.data);
//       performance.mark("start_get_total");
//       // const totalre = await window.api.getTotal_render();
//       // console.log(totalre);
//       // dispatch(setTotal(totalre));
//       dispatch(loadEnd());
//       performance.mark("end_get_total");
//     } else {
//       dispatch(setRank(undefined));
//       performance.mark("end_get_total");
//     }
//   };
//   await update();
// };

export const sendGetmyrank = (): AppThunk => async (dispatch, getState) => {
  if (getState().standingData.load === false) {
    //順位を取得し終わった直後に集計を開始
    await window.api.getRank_on_render(async (arg: any) => {
      dispatch(setRank(arg));
      await window.api.getTotal_on_render((arg: any) => {
        dispatch(setTotal(arg));
        console.log(arg);
        dispatch(loadEnd);
      });
      window.api.getTotalsend_render();
    });

    // 処理実行
    dispatch(loadStart);
    window.api.getRank_send_render();

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
