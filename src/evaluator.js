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

_specialForms["define"] = function(args, scope) {
  if (args.length !== 2 || args[0].type !== "word") {
    throw new SyntaxError("Bad use of define");
  }

  // define can create variables that already exist in the local scope, as long
  // as they have been created in an outer scope (and are therefore non-local)
  if (Object.prototype.hasOwnProperty.call(scope, args[0].name)) {
    throw new ReferenceError("Attempting to re-define local variable");
  }

  let value = _evaluate(args[1], scope);
  scope[args[0].name] = value;

  // define evaluates to the assigned value
  return value;
};

_specialForms["set"] = function(args, scope) {
  if (args.length !== 2 || args[0].type !== "word") {
    throw new SyntaxError("Bad use of set");
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
