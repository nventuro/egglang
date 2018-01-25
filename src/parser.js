exports.parse = _parse;

function _parse(program) {
  program = _removeIgnored(program);

  // The program must be composed of a single expression
  var result = _parseExpression(program);

  if (result.rest.length > 0) {
    throw new SyntaxError("Unexpected text after program");
  }

  return result.expr; // The syntax tree of the parsed expression
}

function _parseExpression(program) {
  var match, expr;

  // Literal strings:
  //  * Multiline string support
  //  * No escape charaters
  //  * Double quotes ('"') are not allowed
  if (match = /^"([^"]*)"/.exec(program)) {
    expr = {type: "value", value: match[1]};

  // Numbers:
  //  * Only positive integers are supported
  } else if (match = /^\d+\b/.exec(program)) {
    expr = {type: "value", value: Number(match[0])};

  // Names (variables, functions, keywords):
  //  * No special characters (parenthesis, comma or double quotes)
  //  * Must not start with a number
  } else if (match = /^[^(),"]+/.exec(program)) {
    expr = {type: "word", name: match[0]};

  } else {
    throw new SyntaxError("Unexpected syntax: " + program);
  }

  // Attempt to parse the rest of the program as an application
  return _parseApply(expr, program.slice(match[0].length));
}

function _parseApply(expr, program) {
  // Applications must start with an opening parenthesis
  if (program[0] != "(") {
    return {expr: expr, rest: program};
  }

  program = program.slice(1);
  expr = {type: "apply", operator: expr, args: []};

  while (program[0] != ")") {
    var arg = _parseExpression(program); // Recursively parse each argument
    expr.args.push(arg.expr);
    program = arg.rest;

    if (program[0] == ",") { // More arguments remain
      program = program.slice(1);
    } else if (program[0] != ")") {
      throw new SyntaxError("Expected ',' or ')'");
    }
  }

  return _parseApply(expr, program.slice(1)); // Support to apply applications
}

function _removeIgnored(string) {
  return string.replace(/(\s|#.*)*/g, ""); // Whitespace is ignored, comments start with '#' and end with a newline
}

exports._removeIgnored = _removeIgnored; // Hacky: to allow unit testing
