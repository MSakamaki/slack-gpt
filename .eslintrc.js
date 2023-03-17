module.exports = {
  env: {
    "googleappsscript/googleappsscript": true,
  },
  plugins: ["googleappsscript"],
  extends: ["standard-with-typescript", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    project: ["./tsconfig.json"],
  },
  rules: {},
};
