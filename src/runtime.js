const parser = require("./parser.js");
const evaluator = require("./evaluator.js");

function _run(program) {
  var env = Object.create(_topEnv);
  return evaluator.evaluate(parser.parse(program), env);
}

exports.run = _run;

var _topEnv = Object.create(null);

_topEnv["true"] = true;
_topEnv["false"] = false;

["+", "-", "*", "/", "==", "<", ">"].forEach(function(op) {
  _topEnv[op] = new Function("a, b", "return a " + op + " b;");
});

_topEnv["print"] = function(value) {
  console.log(value);
  return value;
};
