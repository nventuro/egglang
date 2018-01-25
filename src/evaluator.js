function _evaluate(expr, env) {
  switch(expr.type) {
    case "value":
      return expr.value;

    case "word":
      if (expr.name in env)
        return env[expr.name];
      else
        throw new ReferenceError("Undefined variable: " +
                                 expr.name);
    case "apply":
      if (expr.operator.type == "word" &&
          expr.operator.name in _specialForms)
        return _specialForms[expr.operator.name](expr.args,
                                                env);
      var op = _evaluate(expr.operator, env);
      if (typeof op != "function")
        throw new TypeError("Applying a non-function.");
      return op.apply(null, expr.args.map(function(arg) {
        return _evaluate(arg, env);
      }));
  }
}

exports.evaluate = _evaluate;

var _specialForms = Object.create(null);

_specialForms["if"] = function(args, env) {
  if (args.length != 3)
    throw new SyntaxError("Bad number of args to if");

  if (_evaluate(args[0], env) !== false)
    return _evaluate(args[1], env);
  else
    return _evaluate(args[2], env);
};

_specialForms["while"] = function(args, env) {
  if (args.length != 2)
    throw new SyntaxError("Bad number of args to while");

  while (_evaluate(args[0], env) !== false)
    _evaluate(args[1], env);

  // Since undefined does not exist in Egg, we return false,
  // for lack of a meaningful result.
  return false;
};

_specialForms["do"] = function(args, env) {
  var value = false;
  args.forEach(function(arg) {
    value = _evaluate(arg, env);
  });
  return value;
};

_specialForms["define"] = function(args, env) {
  if (args.length != 2 || args[0].type != "word")
    throw new SyntaxError("Bad use of define");
  var value = _evaluate(args[1], env);
  env[args[0].name] = value;
  return value;
};

_specialForms["fun"] = function(args, env) {
  if (!args.length)
    throw new SyntaxError("Functions need a body");
  function name(expr) {
    if (expr.type != "word")
      throw new SyntaxError("Arg names must be words");
    return expr.name;
  }
  var argNames = args.slice(0, args.length - 1).map(name);
  var body = args[args.length - 1];

  return function() {
    if (arguments.length != argNames.length)
      throw new TypeError("Wrong number of arguments");
    var localEnv = Object.create(env);
    for (var i = 0; i < arguments.length; i++)
      localEnv[argNames[i]] = arguments[i];
    return _evaluate(body, localEnv);
  };
};
