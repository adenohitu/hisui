const login_url = "https://atcoder.jp/login";
/**logincheck */
/* eslint-disable */
function logincheck() {
  const axios = require("axios");
  axios
    .get("https://atcoder.jp/contests/hhkb2020/submit", {
      maxRedirects: 0,
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 302,
    })
    .then((responce) => {
      console.log(responce.status);
      console.log(responce.headers);
    });
} /* eslint-enable */
async function get_csrf() {
  const axios = require("axios");
  const { JSDOM } = await import("jsdom");
  // cookieなしでログインページにアクセス
  const response = await axios(login_url, {
    headers: { Cookie: "" },
  });

  const { document } = new JSDOM(response.data).window;
  const input = document.getElementsByName("csrf_token")[0];
  // console.log(document);
  return input.value;
}
get_csrf().then((csrf) => {
  console.log(csrf);
});
