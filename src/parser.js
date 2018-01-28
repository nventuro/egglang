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
      //  * No special characters (parenthesis, comma or double quotes)
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
