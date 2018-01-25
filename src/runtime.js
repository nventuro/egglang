const parser = require("./parser.js");
const evaluator = require("./evaluator.js");

exports.run = _run;

function _run(program) {
  var env = Object.create(_topEnv);
  return evaluator.evaluate(parser.parse(program), env);
}

var _topEnv = Object.create(null);

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
