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
  contextName: "eslint"
};

lint(paths, options);
