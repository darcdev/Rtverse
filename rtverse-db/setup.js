"use strict";

const inquirer = require("inquirer");
const chalk = require("chalk");
const argv = require("yargs").boolean(["y", "yes"]).argv;
const { setConfigDB } = require("rtverse-utils");
const db = require("./");

const prompt = inquirer.createPromptModule();

async function setup() {
  if (!(argv.y || argv.yes)) {
    const answer = await prompt([
      {
        type: "confirm",
        name: "setup",
        message: "This will destroy your database , are you sure?",
      },
    ]);

    if (!answer.setup) {
      return console.log("Nothing happened :)");
    }
  }

  let config = setConfigDB({ setup: true });
  await db(config).catch(handleFatalError);

  console.log("Success!");
  process.exit(0);
}

function handleFatalError(err) {
  console.error(`${chalk.red("[Fatal Error]")} ${err}`);
  console.error(err.stack);
  process.exit(1);
}
setup();
