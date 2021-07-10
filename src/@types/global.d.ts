export default interface Api {
  electronIpcInvoke: (channel: string, ...arg: any) => Promise<void | string[]>;
}
declare global {
  interface Window {
    api: {
      send;
      ipdtest_send_render;
      ipdtest_on_render;
      urlOpen_render(url: any);
      loginOpen;
      dafaltContestOpen;
      dafaltContestremove;
      set_SetContestID_render;
      get_SetContestID_render;
      get_contest_list_render;
      get_login_status_render;
      login_render;
      logout_render;
      getUsername_render;
      getUserData_render;
      get_date_render;
      get_Standings_render;
      get_Score_render;
      getWindowState_render;
      setWindowState_render;
      resetWindowState_render;
      updateDashboard;
      getRank_render;
      getRank_send_render;
      getRank_on_render;
      getTotal_render;
      getTotalsend_render;
      getTotal_on_render;
      /**
       * 自分の提出を取得
       */
      get_submissions_me_render;
      getSubmissions_send_render;
      getSubmissions_on_render;
      getTasklist_send_render;
      getTasklist_on_render;
      getFiledata_render;
      runWritefile_render;
      changeView;
      onTimerTick;
      copyClipboard;
      readClipboard;
      openLoginDialog;
      openselectDafaultcontest;
    };
    editor: {
      /**
       * Mainからのモデル作成イベントを受け付ける
       * taskcont:createEditorModelType
       */
      createModel(
        func: (createEditorModelType: {
          id: string;
          value: string;
          language: string;
        }) => void
      );
      /**
       * mainからモデルセットのイベントを受け付ける
       * id:string
       */
      setModel(func: (id: string) => void);
      /**
       * mainからファイルのデータの更新を受け取る
       */
      changeValue(
        func: (syncEditorType: { id: string; value: string }) => void
      );
      /**
       * mainから言語の変更を受け取る
       */
      changeLanguage(
        func: (changeLanguageType: { id: string; language: string }) => void
      );
      /**
       * modelの削除を受け取る
       */
      closeModel(func: (id: string) => void);

      /**
       * mainからValueを送信するように依頼されるイベント
       */
      getValue(func: (id: string) => void);
      /**
       * 返信イベント
       */
      getValue_replay(TaskScreenName: string, value: string);

      // mainに送信
      /**
       * TaskContを作成
       */
      createTaskCont(arg: {
        contestName: string;
        TaskScreenName: string;
        AssignmentName: string;
        // 指定がない場合、デフォルトの言語を使用
        language?: languagetype;
      });
      /**
       * ファイルに状態を保存
       */
      save(id: string);

      /**
       * 保存されているdafaultlanguageを取得
       * 初期値はcpp
       */
      getdefaultLanguage();
      /**
       * dafaultlanguageを更新
       */
      setdefaultLanguage(language: string);
      /**
       * 一番上になっているTaskContのコードを提出する
       */
      submitNowTop();
    };
    submissions: {
      /**
       * 提出情報データの更新
       */
      updateSubmissions();
      /**
       * 提出の更新があった時に受け取るIPC
       */
      submissionsReturn(func: (arg: any) => void);
    };
    contests: {
      changeDefaultContestID(func: (contestID: string) => void);
    };
  }
}
