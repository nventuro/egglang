const runtime = require("./runtime");
const readline = require("readline");
const fs = require("fs");

if (require.main === module) {
  let args = process.argv.slice(2); // Remove the Node call to this program from argv

  if (args.length === 0) {
    doREPL();

  } else if (args.length === 1) {
    runFile(args[0]);

  } else {
    throw new Error("Usage: egg.sh [filename]");
  }
}

function doREPL() {
  // To implement a REPL, we need an environment that
  // will persist through multiple runtime.run calls
  let replEnv = runtime.newEnv();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
  });

  rl.on("line", (line) => {
    if (/\S/.test(line)) { // Only parse non-empty lines
      try {
        console.log(runtime.run(line, replEnv));
      }
      catch (error) {
        console.error(error);
      }
    }
    rl.prompt();

  }).on("close", () => {
    console.log("Exiting");
    process.exit(0);
  });

  console.log("Egg 1.0.0\n");
  rl.prompt();
}

function runFile(filename, env) {
  let program = fs.readFileSync(filename, "utf8");
  return runtime.run(program, env);
}

exports._runFile = runFile;
