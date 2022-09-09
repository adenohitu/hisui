import { Page, ElectronApplication, _electron as electron } from "playwright";
jest.setTimeout(200000);
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const express = require("express");
/**
 * webpackDevServerをスタートする
 */
function startWebpackDevServer() {
  return new Promise((resolve) => {
    const app = express();
    const config = require("../../webpack/webpack.dev.js");
    const compiler = webpack(config);
    const instance = webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
    });

    // Tell express to use the webpack-dev-middleware and use the webpack.config.js
    // configuration file as a base.
    app.use(instance);
    instance.waitUntilValid(() => {
      console.log("Package is in a valid state!!!!");

      resolve(true);
    });

    // Serve the files on port 3000.
    app.listen(3000, function () {
      console.log("Example app listening on port 3000!\n");
    });
  });
}
let electronApp: ElectronApplication | null = null;
beforeAll(async () => {
  await startWebpackDevServer();
  electronApp = await electron.launch({ args: ["."] });
});
afterAll(async () => {
  await electronApp?.close();
});

it("E2E test ready", async () => {
  if (electronApp) {
    await Promise.all(
      electronApp.windows().map(async (w: Page, index) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log(await w.title());
        return;
      })
    );
  }
});
