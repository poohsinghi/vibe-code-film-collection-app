module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    // "eslint:recommended",
    // "plugin:import/errors",
    // "plugin:import/warnings",
    // "plugin:import/typescript",
    // "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/dist/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
    "/node_modules/**/*", // Ignore node_modules
    // "*.ts",
    ".eslintrc.js",
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  // rules: {
  //   "quotes": ["error", "double"],
  //   "import/no-unresolved": 0,
  //   "indent": ["error", 2],
  //   "max-len": ["error", {"code": 100}],
  //   "object-curly-spacing": ["error", "always"],
  //   "require-jsdoc": "off",
  //   "valid-jsdoc": "off",
  //   "no-trailing-spaces": "off",
  //   "comma-dangle": "off",
  //   "@typescript-eslint/comma-dangle": "off",
  // },
};
