import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { ipcRendererManager } from "../../ipc";
import { defaultContestIDState } from "../../recoil/atom";

/**
 * IPC Listner Eventを起動
 */
export const RecoilInitEffect = () => {
  const SetDefaultContestID = useSetRecoilState(defaultContestIDState);

  useEffect(() => {
    (async () => {
      const getInitID = await ipcRendererManager.invoke("GET_SET_CONTESTID");
      SetDefaultContestID(getInitID);
    })();
    return ipcRendererManager.on("LISTENER_CHANGE_SET_CONTESTID", (e, arg) => {
      SetDefaultContestID(arg);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};
