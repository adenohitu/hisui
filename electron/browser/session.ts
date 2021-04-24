// electronに保存されているCookieを操作
import { session } from "electron";
import { save_session } from "../save/save_session";

/**
 * atcoder.jpで登録されているセッションを全て表示
 */
export const logSession = () => {
  const sessiondata: string = save_session.get("session");
  console.log(sessiondata);

  session.defaultSession.cookies
    .get({ url: "https://atcoder.jp" })
    .then((cookies) => {
      //   console.log(cookies.find((element) => element.name === "REVEL_SESSION"));
      console.log(cookies);
    })
    .catch((error) => {
      console.log(error);
    });
};

/**
 * save_sessionに保存してあるセッションをウィンドウにも適用する
 */
export const setBrowserCoockie = async () => {
  const sessiondata = save_session.get("session");
  //セッションが保存されている文字列からセッションのvalueを無理矢理取り出す
  const valuestartindex = sessiondata[1].indexOf("=") + 1;
  const valueendindex = sessiondata[1].indexOf(";");
  console.log(sessiondata[1].indexOf("="));

  const sessionvalue = sessiondata[1].substring(valuestartindex, valueendindex);

  const cookieAtcoderSession: any = {
    url: "https://atcoder.jp",
    name: "REVEL_SESSION",
    value: sessionvalue,
    hostOnly: true,
    path: "/",
    secure: true,
    httpOnly: true,
    session: false,
    sameSite: "unspecified",
  };
  session.defaultSession.cookies.set(cookieAtcoderSession).then(
    () => {
      // 成功
    },
    (error) => {
      console.error(error);
    }
  );
};

/**
 * ウィンドウに保存されているセッションを全て消去
 */
export const sessionRemove = () => {
  session.defaultSession.cookies
    .remove("https://atcoder.jp", "REVEL_SESSION")
    .then(
      () => {
        // 成功
      },
      (error) => {
        console.error(error);
      }
    );
};
