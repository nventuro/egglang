function _evaluate(expr, env) {
  switch(expr.type) {
    case "value": {
      return expr.value;
    }

    case "word": {
      if (expr.name in env) {
        return env[expr.name];
      } else {
        throw new ReferenceError("Undefined variable: " + expr.name);
      }
    }

    case "apply": {
      if (expr.operator.type === "word" && expr.operator.name in _specialForms) {
        // Special forms are not evaluated immediately, since some of their parts
        // may never be evaluated (like the not-taken branch of an if)
        return _specialForms[expr.operator.name](expr.args, env);
      }

      let op = _evaluate(expr.operator, env); // Retrieve the function from the environment
      if (typeof op !== "function") {
        throw new TypeError("Applying a non-function");
      }

      // Each function argument must be evaluated before the function itself is evaluated
      return op.apply(null, expr.args.map((arg) => _evaluate(arg, env)));
    }
  }
}

let _specialForms = Object.create(null);

_specialForms["if"] = function(args, env) {
  if (args.length !== 3) { // Egg's if is actually closer to a ternary operator, therefore both sides of the branch are required
    throw new SyntaxError("Bad number of args to if");
  }

  return _isTrue(args[0], env) ? _evaluate(args[1], env) : _evaluate(args[2], env);
};

_specialForms["while"] = function(args, env) {
  if (args.length !== 2) {
    throw new SyntaxError("Bad number of args to while");
  }

  while (_isTrue(args[0], env)) {
    _evaluate(args[1], env);
  }

  // For lack of a meaningful result, while evaluates to false
  return false;
};

_specialForms["do"] = function(args, env) {
  if (args.length === 0) {
    throw new SyntaxError("Do requires at least one argument");
  }

  let value;
  args.forEach(function(arg) {
    value = _evaluate(arg, env);
  });

  // do evaluates to the result of the last expression (usually the program result)
  return value;
};

_specialForms["define"] = function(args, env) {
  if (args.length !== 2 || args[0].type !== "word") {
    throw new SyntaxError("Bad use of define");
  }

  let value = _evaluate(args[1], env);
  env[args[0].name] = value;

  // define evaluates to the assigned value
  return value;
};

_specialForms["set"] = function(args, env) {
  if (args.length !== 2 || args[0].type !== "word") {
    throw new SyntaxError("Bad use of set");
  }

  let name = args[0].name;

  // Loop over the outer environments, until we find one that has the
  // required variable
  let outer_env = env;
  while (!Object.prototype.hasOwnProperty.call(outer_env, name)) {
    outer_env = Object.getPrototypeOf(outer_env);
    if (outer_env === null) {
      throw new ReferenceError("Setting non-existent variable");
    }
  }

  let value = _evaluate(args[1], env);
  outer_env[name] = value;

  // define evaluates to the assigned value
  return value;
};

_specialForms["fun"] = function(args, env) {
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

    // The local environment where the function will be evaluated
    // is created from the current environment, thereby allowing
    // closures to be created
    let localEnv = Object.create(env);
    for (let i = 0; i < arguments.length; i++) {
      localEnv[argNames[i]] = arguments[i];
    }

    return _evaluate(body, localEnv);
  };
};

function _isTrue(expr, env) {
  // Must be false: 0, empty string, etc. do not evaluate as false
  return _evaluate(expr, env) !== false;
}

exports.evaluate = _evaluate;
