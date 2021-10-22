const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".css", ".scss", ".sass"],
    alias: {
      vscode: require.resolve(
        "@codingame/monaco-languageclient/lib/vscode-compatibility"
      ),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: "ts-loader" }],
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[hash].[ext]",
          outputPath: "assets", // 出力先
          publicPath: "./assets",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
    new CopyPlugin({
      patterns: [{ from: "public", to: "" }],
    }),
  ],
};
