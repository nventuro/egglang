const runtime = require("./runtime.js");

if (require.main === module) {
  var args = process.argv.slice(2);
  if (args.length != 1) {
    return;
  }

  var program = args[0];
  runtime.run(program);
}
