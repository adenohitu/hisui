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
    };
  }
}
