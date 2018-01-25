function _parse(program) {
  program = _removeIgnored(program);

  var result = _parseExpression(program);
  if (result.rest.length > 0)
    throw new SyntaxError("Unexpected text after program");
  return result.expr;
}

exports.parse = _parse;

function _parseExpression(program) {
  var match, expr;
  if (match = /^"([^"]*)"/.exec(program))
    expr = {type: "value", value: match[1]};
  else if (match = /^\d+\b/.exec(program))
    expr = {type: "value", value: Number(match[0])};
  else if (match = /^[^\s(),"]+/.exec(program))
    expr = {type: "word", name: match[0]};
  else
    throw new SyntaxError("Unexpected syntax: " + program);

  return _parseApply(expr, program.slice(match[0].length));
}

function _parseApply(expr, program) {
  if (program[0] != "(")
    return {expr: expr, rest: program};

  program = program.slice(1);
  expr = {type: "apply", operator: expr, args: []};
  while (program[0] != ")") {
    var arg = _parseExpression(program);
    expr.args.push(arg.expr);
    program = arg.rest;
    if (program[0] == ",")
      program = program.slice(1);
    else if (program[0] != ")")
      throw new SyntaxError("Expected ',' or ')'");
  }
  return _parseApply(expr, program.slice(1));
}

function _removeIgnored(string) {
  return string.replace(/(\s|#.*)*/g, "");
}
