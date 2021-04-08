const axios = require("axios");
// const BASE_URL = "https://atcoder.jp";
const url = "https://atcoder.jp/login";
// const geturl = "https://atcoder.jp/contests/hhkb2020/submit";
const axiosInstance = axios.create();
axiosInstance.defaults.withCredentials = true;
async function get_csrf() {
  const { JSDOM } = await import("jsdom");
  // cookieなしでログインページにアクセス
  const response = await axiosInstance.get(url, { headers: { Cookie: "" } });

  //csrf_tokenをスクレイピング
  const { document } = new JSDOM(response.data).window;
  const input = document.getElementsByName("csrf_token")[1];
  //cookieを保存
  const Cookie = response.headers["set-cookie"];
  // console.log(response.headers);
  axiosInstance.defaults.headers.Cookie = Cookie;
  return [input.value, Cookie];
}

get_csrf().then((res) => {
  //配列をそのまま書くとoptionで送信してしまうためここで変換する
  const params = new URLSearchParams();
  params.append("csrf_token", res[0]);
  params.append("username", "");
  params.append("password", "");
  axiosInstance
    .post(url, params, {
      maxRedirects: 0,
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 302,
    })
    .then((result) => {
      console.log("ok");
      //ログイン成功するとUserScreenNameの入ったクッキーが保存される
      const Cookie = result.headers["set-cookie"];
      //axios instanceにセット
      axiosInstance.defaults.headers.Cookie = Cookie;
      console.log(axiosInstance.defaults.headers.Cookie);
    })
    .catch((err) => {
      console.log(err);
    });
});
