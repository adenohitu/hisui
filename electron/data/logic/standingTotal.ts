/**
 * 順位表データJSONから問題ごとに回答・正解ユーザー数を取得する
 */
export const totalfn = async (data: any) => {
  //問題データを取得
  const taskInfo = await data.TaskInfo;

  //問題を一つずつ取り出す
  const total = await taskInfo.reduce(async (prev: any, current: any) => {
    // 順位表を検索して集計する
    //問題の名前を取得
    const TaskScreenName = current.TaskScreenName;

    const Assignment = current.Assignment;
    const TaskName = current.TaskName;
    //
    const submitAll = await data.StandingsData.reduce(
      (redata: any, owndata: any) => {
        if (owndata.TaskResults[TaskScreenName] !== undefined) {
          return (redata += 1);
        } else {
          return redata;
        }
      },
      0
    );
    const submitAC = await data.StandingsData.reduce(
      (redata: any, owndata: any) => {
        const taskdata = owndata.TaskResults[TaskScreenName];
        if (taskdata !== undefined) {
          if (taskdata.Status === 1) {
            return (redata += 1);
          } else {
            return redata;
          }
        } else {
          return redata;
        }
      },
      0
    );

    // 集計したデータとTaskScreenNameを保存する
    const retuendata = await prev;
    //pushは破壊的処理
    await retuendata.push({
      Assignment,
      TaskName,
      TaskScreenName,
      submitAll,
      submitAC,
    });
    return retuendata;
  }, []);
  return total;
};
