"use strict";
const chalk = require("chalk");
const debug = require("debug")("rtverse:api");
const http = require("http");
const express = require("express");
const api = require("./api");
const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

app.use("/api", api);

app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`);
  if (err.message.match(/not found/)) {
    return res.status(404).send({
      error: err.message,
    });
  }
  res.status(500).send({
    error: err.message,
  });
});

function handleFatalError(err) {
  console.error(`${chalk.red("[fatal error]")} ${err.message}`);
  console.error(err.stack);
  process.exit(1);
}

if (!module.main) {
  process.on("uncaughtException", handleFatalError);
  process.on("unhandledRejection", handleFatalError);
  server.listen(port, () => {
    console.log(
      `${chalk.green("[rtverse-api]")} server is listening on port ${port}`
    );
  });
}

module.exports = server;
