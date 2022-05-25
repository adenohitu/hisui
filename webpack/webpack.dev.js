const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    contentBase: "../build",
    open: false,
  },
  devtool: "inline-source-map",
});
