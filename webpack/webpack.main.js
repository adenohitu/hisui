const path = require("path");
const preload = require("./webpack.preload.js");
const nodeExternals = require("webpack-node-externals");
const env = process.env.NODE_ENV || "development";
const isDevelopment = env === "development";
const main = {
  mode: env,
  target: "electron-main",
  node: {
    __dirname: false,
    __filename: false,
  },
  devtool: isDevelopment ? "source-map" : false,
  entry: {
    main: path.join(__dirname, "../src_main/main.ts"),
  },
  output: {
    path: path.resolve(__dirname, "../build/src_main"),
    filename: "main.js",
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
module.exports = [main, preload];
