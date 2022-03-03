export default interface Api {
  electronIpcInvoke: (channel: string, ...arg: any) => Promise<void | string[]>;
}
declare global {
  interface Window {
    editor: {
      /**
       * mainからValueを送信するように依頼されるイベント
       */
      getValue(func: (id: string) => void);
      /**
       * 返信イベント
       */
      getValue_replay(TaskScreenName: string, value: string);
    };
    // TaskViewWindowのPreloadにだけ存在
    ipc: any;
  }
}
