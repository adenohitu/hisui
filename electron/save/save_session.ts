const Store = require("electron-store");
const key: string =
  "22MVHL6zmw7fTHRDLz9M9Fw5nmTNSy8gbTVwCK9Xhc8uW8b21sY0CxAnaKtZqYpkVuT8GXCZH5lOB46e4CVQsvRW2CgWdcpnujJw";
export const saveSession = new Store({
  name: "session", // ファイル名
  fileExtension: "", // 拡張子
  encryptionKey: key, //暗号化（気休め）
});
