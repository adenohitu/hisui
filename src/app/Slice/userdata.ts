//ユーザー個人のレートなどのデータを管理
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store";

interface userData {
  username: string | undefined;
  loginStatus: boolean | undefined;
}
const initialState: userData = {
  username: undefined,
  loginStatus: undefined,
};

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setdata: (state, action: PayloadAction<userData>) => {
      state.username = action.payload.username;
      state.loginStatus = action.payload.loginStatus;
    },
  },
});
export const { setdata } = userDataSlice.actions;
export const requestAsync = (): AppThunk => async (dispatch) => {
  const getDataipc = async () => {
    const username = await window.api.getUsername_render();
    const loginStatus = await window.ipc.LOGIN_STATUS();
    return { username, loginStatus };
  };
  dispatch(setdata(await getDataipc()));
};

export const selectloginStatus = (state: RootState) => {
  return state.userData.loginStatus;
};
export const selectusername = (state: RootState) => {
  return state.userData.username;
};

export default userDataSlice.reducer;
