const runtime = require("./runtime.js");

if (require.main === module) {
  var args = process.argv.slice(2); // Remove the Node call to this program from argv

  if (args.length != 1) {
    throw new Error("Wrong number of arguments");
  }

  var program = args[0];
  runtime.run(program);
}
