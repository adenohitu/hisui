module.exports = {
  roots: ["."],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsconfig: "./src_main/tsconfig.json",
    },
  },
  setupFilesAfterEnv: ["./jest.setup.js"],
};
