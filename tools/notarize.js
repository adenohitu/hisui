require("dotenv").config();
const { notarize } = require("electron-notarize");

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
  console.log("start Appcation notarize");
  console.log(process.env);
  return await notarize({
    appBundleId: "com.adenohitu.hisui",
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
    ascProvider: process.env.ASC_PROVIDER,
  });
};
