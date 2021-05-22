//ケース作成で使うState
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Layout } from "react-grid-layout";
import { AppThunk, RootState } from "../store";
export interface elementStatus {
  min: number;
  leftsign: string;
  rightsign: string;
  max: number;
  color?: string;
}
interface createCase {
  viewState: Layout[];
  elementStatus: { [i: string]: elementStatus };
}
const initialState: createCase = {
  viewState: [],
  elementStatus: {},
};
interface setElementInput {
  variableName: string;
  elementStatus: elementStatus;
}
export const createCaseSlice = createSlice({
  name: "createCase",
  initialState,
  reducers: {
    setElementStatus: (state, action: PayloadAction<setElementInput>) => {
      state.elementStatus[action.payload.variableName] =
        action.payload.elementStatus;
    },
    setElement: (state, action: PayloadAction<any>) => {
      state.viewState = action.payload;
    },
    changeData: (state, action: PayloadAction<any>) => {
      state.viewState = action.payload;
    },
  },
});
export const { setElementStatus, setElement, changeData } =
  createCaseSlice.actions;
// onLayoutChangeの戻りを入力
export const changeLayout =
  (layout: Layout[]): AppThunk =>
  async (dispatch, getState) => {
    dispatch(changeData(layout));
    console.log(layout);
  };
// 新たなElementを作成
export const addElement =
  (variableName: string, w: number, elementStatus: elementStatus): AppThunk =>
  async (dispatch, getState) => {
    // すでに存在するかを確認
    if (variableName in getState().createCase.elementStatus) {
      return "already";
    } else {
      //作成するElementの制約情報とスタイルを設定
      await dispatch(setElementStatus({ variableName, elementStatus }));
      //新しいElementを追加
      const data = getState().createCase.viewState;
      dispatch(
        setElement(
          data.concat([
            { i: variableName, x: 0, y: 0, w, h: 1, isResizable: false },
          ])
        )
      );
    }
  };
export const viewStateLoad = (state: RootState) => {
  return state.createCase.viewState;
};

export default createCaseSlice.reducer;
