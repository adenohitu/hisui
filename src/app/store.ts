import {
  configureStore,
  ThunkAction,
  Action,
  // getDefaultMiddleware,
} from "@reduxjs/toolkit";
import counterReducer from "../component/counter/counterSlice";
import standingsSlice from "./Slice/standings";
import userDataSlice from "./Slice/userdata";
import scoreDataSlice from "./Slice/score";
import submissionsSlice from "./Slice/submissions";
import contestDataSlice from "./Slice/contestdata";
import taskDataSlice from "./Slice/taskdata";
import editorDataSlice from "./Slice/editor";
import createCaseSlice from "./Slice/casecont";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    standingData: standingsSlice,
    userData: userDataSlice,
    scoreData: scoreDataSlice,
    submissionsData: submissionsSlice,
    contestData: contestDataSlice,
    taskData: taskDataSlice,
    editorData: editorDataSlice,
    createCase: createCaseSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableStateInvariant: false,
      serializableCheck: false,
    }),
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
