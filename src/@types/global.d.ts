import { atcoderCodeTestResult } from "../../src_main/casetester/atcoder";

export default interface Api {
  electronIpcInvoke: (channel: string, ...arg: any) => Promise<void | string[]>;
}
declare global {
  interface Window {
    api: {
      send;
      ipdtest_send_render;
      ipdtest_on_render;
      loginOpen;
      dafaltContestOpen;
      resetWindowState_render;
      updateDashboard;
      getRank_send_render;
      getRank_on_render;
      getTotal_render;
      getTotalsend_render;
      getTotal_on_render;
      onTimerTick;
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
      setdefaultLanguage(language: string, load: boolean);
      /**
       * 一番上になっているTaskContのコードを提出する
       */
      submitNowTop();
      /**
       * 一番上になっているTaskContのコードをテストする
       */
      runcodeTestNowTop(samplecase: string, answer: string | null = null);
      /**
       * コードテストの結果の更新イベントを受け取る
       */
      codeTestStatusEvent(func: (arg: atcoderCodeTestResult) => void);
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
    // TaskViewWindowのPreloadにだけ存在
    taskview: {
      /**
       * TaskViewのURLを初期状態に戻す
       */
      nowTaskViewReset();
    };
    ipc: any;
  }
}
