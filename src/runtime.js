const parser = require("./parser");
const evaluator = require("./evaluator");

exports.run = _run;
exports.newEnv = _newEnv;

function _run(program, env) {
  env = env || _newEnv();
  return evaluator.evaluate(parser.parse(program), env);
}

function _newEnv() {
  return Object.create(_topEnv);
}

let _topEnv = Object.create(null);

// Boolean values (stored as variables)
_topEnv["true"] = true;
_topEnv["false"] = false;

// Standard binary operators
["+", "-", "*", "/", "==", "<", ">"].forEach(function(op) {
  _topEnv[op] = new Function("a, b", "return a " + op + " b;");
});

_topEnv["print"] = function(value) {
  console.log(value);

  // For lack of a meaningful result, print evaluates to the printed value
  return value;
};
