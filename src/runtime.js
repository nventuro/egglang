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
["+", "-", "*", "/", "==", "!=", "<", "<=", ">", ">="].forEach((op) => {
  _topEnv[op] = eval(`(a, b) => a ${op} b`);
});

_topEnv["print"] = function(value) {
  console.log(value);

  // For lack of a meaningful result, print evaluates to the printed value
  return value;
};

_topEnv["array"] = function() {
  return Array.prototype.slice.call(arguments);
};

_topEnv["dict"] = function() {
  if (arguments.length % 2 !== 0) {
    throw new SyntaxError("Bad number of args to dict");
  }

  let dict = {};
  for (let i = 0; i < arguments.length; i += 2) {
    dict[arguments[i]] = arguments[i + 1];
  }

  return dict;
};

_topEnv["length"] = function(obj) {
  if (obj instanceof Array) {
    return obj.length;
  } else if (obj instanceof Object) {
    return Object.keys(obj).length;
  } else {
    throw new TypeError("Can only call length on dicts or arrays");
  }
};

_topEnv["get"] = function(obj, idx) {
  if (obj instanceof Array) {
    if (typeof idx !== "number" || idx < 0 || idx >= obj.length) {
      throw new ReferenceError("Illegal index");
    }
  } else if (obj instanceof Object) {
    if (!(idx in obj)) {
      throw new ReferenceError("Unknown object property");
    }
  } else {
    throw new TypeError("Can only call get on dicts or arrays");
  }

  return obj[idx];
};
