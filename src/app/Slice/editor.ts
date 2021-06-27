//TaskviewとEditorの状態を管理
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store";

interface editorData {
  editorvalue: any;
  contestId: string | undefined;
  TaskScreenName: string | undefined;
  taskname: string | undefined;
  taskurl: string | undefined;
  //ロード中はtrue
  load: boolean;
}
const initialState: editorData = {
  editorvalue: "",
  contestId: undefined,
  TaskScreenName: undefined,
  taskname: undefined,
  taskurl: "/testpage.html",
  load: false,
};

export const editorDataSlice = createSlice({
  name: "editorData",
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    seteditorvalue: (state, action: PayloadAction<any>) => {
      state.editorvalue = action.payload;
    },
    setcontestId: (state, action: PayloadAction<any>) => {
      state.contestId = action.payload;
    },
    settaskname: (state, action: PayloadAction<any>) => {
      state.taskname = action.payload;
    },
    setTaskScreenName: (state, action: PayloadAction<any>) => {
      state.TaskScreenName = action.payload;
    },
    settaskurl: (state, action: PayloadAction<any>) => {
      state.taskurl = action.payload;
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
  seteditorvalue,
  setcontestId,
  setTaskScreenName,
  settaskname,
  settaskurl,
  loadStart,
  loadEnd,
} = editorDataSlice.actions;
/**
 * mainにTaskContを作成するように命令
 */
export const loadtask =
  (
    contestName: string,
    TaskScreenName: string,
    AssignmentName: string
  ): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setcontestId(contestName));
    dispatch(setTaskScreenName(TaskScreenName));
    dispatch(settaskname(AssignmentName));
    // taskContを作成
    // 存在する場合フォーカスする
    window.editor.createTaskCont({
      contestName,
      TaskScreenName,
      AssignmentName,
    });
  };
/**
 * taskcontにいまの状態を保存するように命令
 */
export const saveValue = (): AppThunk => async (dispatch, getState) => {
  const taskid = await getState().editorData.TaskScreenName;
  if (taskid !== undefined) {
    window.editor.save(taskid);
  }
};

export const selecteditorvalue = (state: RootState) => {
  return state.editorData.editorvalue;
};
export const selecttaskurl = (state: RootState) => {
  return state.editorData.taskurl;
};
export const selectload = (state: RootState) => {
  return state.scoreData.load;
};
export default editorDataSlice.reducer;
