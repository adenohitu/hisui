const { notarize } = require("electron-notarize");
require("dotenv").config();
exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== "darwin") {
    return;
  }
  // eslint-disable-next-line eqeqeq
  if (process.env.CSC_IDENTITY_AUTO_DISCOVERY == "false") {
    console.log("skip Appcation notarize");
    return;
  }
  const appName = context.packager.appInfo.productFilename;
  const appleApiKey = process.env.APIKEYID;
  if (!appleApiKey) throw new Error("no appleApiKey found");
  const appleApiIssuer = process.env.APIISSUER;
  if (!appleApiIssuer) throw new Error("no appleApiIssuer found");
  console.log("start Appcation notarize");
  return await notarize({
    appBundleId: "com.adenohitu.hisui",
    appPath: `${appOutDir}/${appName}.app`,
    appleApiKey,
    appleApiIssuer,
  });
};
