"use strict";

const debug = require("debug")("rtverse:mqtt");
const mosca = require("mosca");
const redis = require("redis");
const chalk = require("chalk");

const backend = {
  type: "redis",
  redis,
  return_buffers: true,
};
const settings = {
  port: 1883,
  backend,
};

const server = mosca.Server(settings);

server.on("clientConnected", (client) => {
  debug(`Client connected : ${client.id}`);
});

server.on("ClientDisconnected", (client) => {
  debug(`Client disconnected : ${client.id}`);
});

server.on("published", (packet, client) => {
  debug(`Received : ${packet.topic}`);
  debug(`Payload : ${packet.payload}`);
});

server.on("ready", () => {
  console.log(`${chalk.green("[rtverse-mqtt]")} server is running`);
});

server.on("error", handleFatalError);

function handleFatalError(err) {
  console.error(`${chalk.red("[fatal error]")} ${err.message}}`);
  console.error(err.stack);
  process.exit(1);
}

process.on("uncaughtException", handleFatalError);
process.on("unhandledRejection", handleFatalError);
