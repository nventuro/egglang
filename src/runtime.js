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
["+", "-", "*", "/", "%", "==", "!=", "<", "<=", ">", ">="].forEach((op) => {
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
  return _typeHandler(obj,
    (arr) => arr.length,
    (dict) => Object.keys(dict).length
  );
};

_topEnv["get"] = function(obj, elem) {
  return _typeHandler(obj,
    (arr, idx) => {
      if (typeof idx !== "number" || idx < 0 || idx >= arr.length) {
        throw new ReferenceError("Illegal index");
      }
      return arr[idx];
    },
    (dict, prop) => {
      if (!(prop in dict)) {
        throw new ReferenceError("Unknown dict key");
      }
      return dict[prop];
    }, elem);
};

_topEnv["push"] = function(obj, key, value) {
  _typeHandler(obj,
    (arr, elem) => { // For arrays, 'key' will be the pushed value
      if (arguments.length !== 2) {
        throw new SyntaxError("Can only push one element to array");
      }
      arr.push(elem);
    },
    (obj, key, value) => {
      if (arguments.length !== 3) {
        throw new SyntaxError("Can only push key-value pairs to dict");
      }
      obj[key] = value;
    }, key, value);

  return obj;
};

function _typeHandler(obj, arr_handler, dict_handler) {
  let args = [].slice.call(arguments).slice(3); // Remaining arguments
  args.unshift(obj); // The object is always the first argument

  if (obj instanceof Array) {
    return arr_handler.apply(null, args);
  } else if (obj instanceof Object) {
    return dict_handler.apply(null, args);
  } else {
    throw new TypeError("Can only call on arrays or dicts");
  }
}
