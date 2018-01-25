const runtime = require("./runtime.js");
const readline = require("readline");
const fs = require("fs");

if (require.main === module) {
  var args = process.argv.slice(2); // Remove the Node call to this program from argv

  if (args.length == 0) {
    REPL();

  } else if (args.length == 1) {
    runFile(args[0]);

  } else {
    throw new Error("Usage: egg.sh [filename]");
  }
}

function REPL() {
  console.log("Egg 1.0.0\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
  });

  rl.prompt();

  var replEnv = runtime.newEnv();

  rl.on('line', (line) => {
    console.log(runtime.run(line, replEnv));
    rl.prompt();

  }).on('close', () => {
    console.log('Exiting');
    process.exit(0);
  });
}

function runFile(filename) {
  var program = fs.readFileSync(filename, "utf8");
  runtime.run(program);
}
