#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const glob = require("glob");
const meow = require("meow");

async function main() {
  const cli = meow(
    `
    Usage of cp2

    $ cp2 [--dry-run] [--verbose] SRC EXPR
   
    SRC  - input src files glob
    EXPR - javascript function that accepts filename as string and returns
           target filename

        --dry-run    Don't copy or move files. For testing the function.
        --verbose    Output src and target file locations. 
        --move       Move instead of copy.

    Examples
    $ cp2 '**/*.js' 'f=>f.replace(/.*\/src\/([^\/]+)\/.*\/([^\/]+)$/,"out/$1/$2")'
 
    Please use single-quotes enclosed arguments to protect glob and expression
    from interpretion by your shell.
`,
    {
      flags: {
        "dry-run": {
          type: "boolean",
        },
        verbose: {
          type: "boolean",
        },
        move: {
          type: "boolean",
        },
      },
    }
  );

  if (cli.input.length < 2) {
    console.error(cli.help);
    process.exit(1);
  }

  const files = glob.sync(cli.input[0], {
    ignore: ["**/node_modules/**"],
  });

  let findReplace;
  try {
    findReplace = eval(cli.input.slice(1).join(" "));
  } catch (error) {
    console.error("javascript find-replace-function contains error:");
    console.error(error);
    process.exit(2);
  }

  files.forEach((f) => {
    let target = findReplace.call(findReplace, f);

    if (f === target) {
      console.log(`ommiting ${f}: src and target are equal`);
    } else {
      if (cli.flags.verbose) {
        console.log(`${cli.flags.move ? "mv" : "cp"} ${f} ==> ${target}`);
      }

      if (!cli.flags.dryRun) {
        fs.mkdirSync(path.dirname(target), { recursive: true });
        cli.flags.move ? fs.renameSync(f, target) : fs.copyFileSync(f, target);
      }
    }
  });
}

main();
