(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.egg_runtime = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
function _evaluate(expr, scope) {
  switch(expr.type) {
    case "value": {
      return expr.value;
    }

    case "word": {
      if (expr.name in scope) {
        return scope[expr.name];
      } else {
        throw new ReferenceError("Undefined variable: " + expr.name);
      }
    }

    case "apply": {
      if (expr.operator.type === "word" && expr.operator.name in _specialForms) {
        // Special forms are not evaluated immediately, since some of their parts
        // may never be evaluated (like the not-taken branch of an if)
        return _specialForms[expr.operator.name](expr.args, scope);
      }

      let op = _evaluate(expr.operator, scope); // Retrieve the function from the scope
      if (typeof op !== "function") {
        throw new TypeError("Applying a non-function");
      }

      // Each function argument must be evaluated before the function itself is evaluated
      return op.apply(null, expr.args.map((arg) => _evaluate(arg, scope)));
    }
  }
}

let _specialForms = Object.create(null);

_specialForms["if"] = function(args, scope) {
  if (args.length !== 3) { // Egg's if is actually closer to a ternary operator, therefore both sides of the branch are required
    throw new SyntaxError("Bad number of args to if");
  }

  return _isTrue(args[0], scope) ? _evaluate(args[1], scope) : _evaluate(args[2], scope);
};

_specialForms["while"] = function(args, scope) {
  if (args.length !== 2) {
    throw new SyntaxError("Bad number of args to while");
  }

  while (_isTrue(args[0], scope)) {
    _evaluate(args[1], scope);
  }

  // For lack of a meaningful result, while evaluates to false
  return false;
};

_specialForms["do"] = (args, scope) => {
  if (args.length === 0) {
    throw new SyntaxError("Do requires at least one argument");
  }

  // do creates a local scope in which its arguments are evaluated
  let localScope = Object.create(scope);
  let value;
  args.forEach(function(arg) {
    value = _evaluate(arg, localScope);
  });

  // do evaluates to the result of the last expression (usually the program result)
  return value;
};

_specialForms[":="] = function(args, scope) {
  if (args.length !== 2 || args[0].type !== "word") {
    throw new SyntaxError("Bad use of :=");
  }

  // := can create variables that already exist in the local scope, as long
  // as they have been created in an outer scope (and are therefore non-local)
  if (Object.prototype.hasOwnProperty.call(scope, args[0].name)) {
    throw new ReferenceError("Attempting to re-define local variable");
  }

  let value = _evaluate(args[1], scope);
  scope[args[0].name] = value;

  // := evaluates to the assigned value
  return value;
};

_specialForms["="] = function(args, scope) {
  if (args.length !== 2 || args[0].type !== "word") {
    throw new SyntaxError("Bad use of =");
  }

  let name = args[0].name;

  // Loop over the outer scopes, until we find one that has the
  // required variable
  let outerScope = scope;
  while (!Object.prototype.hasOwnProperty.call(outerScope, name)) {
    outerScope = Object.getPrototypeOf(outerScope);
    if (outerScope === null) {
      throw new ReferenceError("Setting non-existent variable");
    }
  }

  let value = _evaluate(args[1], scope);
  outerScope[name] = value;

  // define evaluates to the assigned value
  return value;
};

_specialForms["fun"] = function(args, scope) {
  if (!args.length) {
    throw new SyntaxError("Functions need a body");
  }

  // The first n-1 fun arguments are the function arguments
  let argNames = args.slice(0, args.length - 1).map(function(arg) {
    if (arg.type !== "word") {
      throw new SyntaxError("Arg names must be words");
    }
    return arg.name;
  });

  // The final argument is the function body
  let body = args[args.length - 1];

  return function() {
    if (arguments.length !== argNames.length) {
      throw new TypeError("Wrong number of arguments");
    }

    // The local scope where the function will be evaluated
    // is created from the current scope, thereby allowing
    // closures to be created
    let localScope = Object.create(scope);
    for (let i = 0; i < arguments.length; i++) {
      localScope[argNames[i]] = arguments[i];
    }

    return _evaluate(body, localScope);
  };
};

function _isTrue(expr, scope) {
  // Must be false: 0, empty string, etc. do not evaluate as false
  return _evaluate(expr, scope) !== false;
}

exports.evaluate = _evaluate;

},{}],3:[function(require,module,exports){
function _parse(program) {
  program = _removeIgnored(program);

  // The program must be composed of a single expression
  let result = _parseExpression(program);

  if (result.rest.length > 0) {
    throw new SyntaxError("Unexpected text after program");
  }

  return result.expr; // The syntax tree of the parsed expression
}

function _parseExpression(program) {
  let matchers = [
    {
      // Literal strings:
      //  * No escape charaters
      //  * Double quotes ('"') are not allowed
      regex: /^"([^"]*)"/,
      expr: (match) => {return {type: "value", value: match[1]};}
    }, {
      // Numbers:
      //  * Only integers are supported
      regex: /^[+-]?\d+\b/,
      expr: (match) => {return {type: "value", value: Number(match[0])};}
    }, {
      // Names (variables, functions, keywords):
      //  * No special characters (parenthesis, comma, or double quotes)
      //  * Must not start with a number
      regex: /^[^\d(),"][^(),"]*/,
      expr: (match) => {return {type: "word", name: match[0]};}
    }
  ];

  let expr, match;
  matchers.some((matcher) => {
    match = matcher.regex.exec(program);
    if (match) {
      expr = matcher.expr(match);
      return true;
    }
  });

  if (!expr) {
    throw new SyntaxError("Unexpected syntax: " + program);
  }

  // Attempt to parse the rest of the program as an application
  return _parseApply(expr, program.slice(match[0].length));
}

function _parseApply(expr, program) {
  // Applications must start with an opening parenthesis
  if (program[0] !== "(") {
    return {expr: expr, rest: program};
  }

  program = program.slice(1);
  expr = {type: "apply", operator: expr, args: []};

  while (program[0] !== ")") {
    let arg = _parseExpression(program); // Recursively parse each argument
    expr.args.push(arg.expr);
    program = arg.rest;

    if (program[0] === ",") { // More arguments remain
      program = program.slice(1);
    } else if (program[0] !== ")") {
      throw new SyntaxError("Expected ',' or ')'");
    }
  }

  return _parseApply(expr, program.slice(1)); // Support to apply applications
}

function _removeIgnored(string) {
  return string.replace(/(\s|#.*)*/g, ""); // Whitespace is ignored, comments start with '#' and end with a newline
}

exports.parse = _parse;
exports._removeIgnored = _removeIgnored;

},{}],4:[function(require,module,exports){
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

},{"./evaluator":2,"./parser":3,"fs":1}]},{},[4])(4)
});