"use strict";

const debug = require("debug")("rtverse:db:setup");
const inquirer = require("inquirer");
const chalk = require("chalk");
const argv = require("yargs").boolean(["y", "yes"]).argv;

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
  const config = {
    database: process.env.DB_NAME || "rtverse",
    username: process.env.DB_USER || "darcdev",
    password: process.env.DB_PASS || "diego",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: (s) => debug(s),
    setup: true,
  };

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
