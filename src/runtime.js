const parser = require("./parser");
const evaluator = require("./evaluator");
const fs = require("fs");

exports.run = _run;
exports.newScope = _newScope;

function _run(program, scope) {
  scope = scope || _newScope();
  return evaluator.evaluate(parser.parse(program), scope);
}

function _newScope() {
  return Object.create(_topScope);
}

let _topScope = Object.create(null);

// Boolean values (stored as variables)
_topScope["true"] = true;
_topScope["false"] = false;

// Standard binary operators
["+", "-", "*", "/", "%", "==", "!=", "<", "<=", ">", ">="].forEach((op) => {
  _topScope[op] = eval(`(a, b) => a ${op} b`);
});

_topScope["print"] = function(value) {
  console.log(value);

  // For lack of a meaningful result, print evaluates to the printed value
  return value;
};

_topScope["import"] = function(filename) {
  return _run(fs.readFileSync(filename, "utf8"));
};

_topScope["array"] = function() {
  return Array.prototype.slice.call(arguments);
};

_topScope["dict"] = function() {
  if (arguments.length % 2 !== 0) {
    throw new SyntaxError("Bad number of args to dict");
  }

  let dict = {};
  for (let i = 0; i < arguments.length; i += 2) {
    dict[arguments[i]] = arguments[i + 1];
  }

  return dict;
};

_topScope["length"] = function(obj) {
  return _typeHandler(obj,
    (arr) => arr.length,
    (dict) => Object.keys(dict).length
  );
};

_topScope["get"] = function(obj, elem) {
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

_topScope["push"] = function(obj, key, value) {
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
