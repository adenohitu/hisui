const path = require("path");

const outputPath = path.join(__dirname, "build/main/");
const mainConfig = {
  entry: "./electron/main.ts",
  target: "node",
  output: {
    path: outputPath,
    filename: "main.js",
  },
  externals: {
    canvas: "commonjs canvas",
    fsevents: "require('fsevents')",
  },
  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: "ts-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};

module.exports = mainConfig;
