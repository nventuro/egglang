const lint = require("mocha-eslint");

const paths = [
  "*.js",
  "src/**/*.js",
  "test/**/*.js",
];

const options = {
  formatter: "stylish",
  alwaysWarn: true,
  strict: true,
  timeout: 5000,
  slow: 1000,
  contextName: "ESLint"
};

lint(paths, options);
