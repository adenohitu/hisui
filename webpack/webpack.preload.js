const path = require("path");
const nodeExternals = require("webpack-node-externals");
const env = process.env.NODE_ENV || "development";
const isDevelopment = env === "development";

module.exports = {
  mode: env,
  target: "electron-preload",
  devtool: isDevelopment ? "source-map" : false,
  entry: {
    preload: path.join(__dirname, "../src_main/preload.ts"),
    "atcoder-preload": path.join(
      __dirname,
      "../src_main/browser/preload/atcoder-preload.ts"
    ),
    "web-preload": path.join(
      __dirname,
      "../src_main/browser/preload/web-preload.ts"
    ),
  },
  output: {
    path: path.resolve(__dirname, "../build/preload"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".js"],
  },
  externals: [nodeExternals()],
};
