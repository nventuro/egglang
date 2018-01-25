const runtime = require("./runtime.js");
const fs = require("fs");

if (require.main === module) {
  var args = process.argv.slice(2); // Remove the Node call to this program from argv

  if (args.length == 0) {
    throw new Error("No REPL yet");

  } else if (args.length == 1) {
    var filename = args[0];
    var program = fs.readFileSync(filename, "utf8");
    runtime.run(program);

  } else {
    throw new Error("Usage: egg.sh [filename]");
  }
}
