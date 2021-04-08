const Atcoder = require("../atcoder");
//atcoder classの使用例
// 関数呼び出し
const url = "https://atcoder.jp/contests/?lang=ja";
const use_class = new Atcoder(url);

use_class.getContestInfo().then((result) => {
  // ここにipc onを入れればうまくいく
  console.log(result);
});
