import {
  configureStore,
  ThunkAction,
  Action,
  // getDefaultMiddleware,
} from "@reduxjs/toolkit";
import counterReducer from "../component/counter/counterSlice";
import standingsSlice from "./Slice/standings";
import scoreDataSlice from "./Slice/score";
import submissionsSlice from "./Slice/submissions";
import contestDataSlice from "./Slice/contestdata";
import taskDataSlice from "./Slice/taskdata";
import createCaseSlice from "./Slice/casecont";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    standingData: standingsSlice,
    scoreData: scoreDataSlice,
    submissionsData: submissionsSlice,
    contestData: contestDataSlice,
    taskData: taskDataSlice,
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
