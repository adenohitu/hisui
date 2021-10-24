module.exports = {
  webpack: {
    alias: {
      vscode: require.resolve(
        "@codingame/monaco-languageclient/lib/vscode-compatibility"
      ),
    },
  },
};
