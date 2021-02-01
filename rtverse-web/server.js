"use strict";

const debug = require("debug")("rtverse:web");
const chalk = require("chalk");
const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const rtverseAgent = require("rtverse-agent");
const { pipe } = require("rtverse-utils");
const io = socketio(server);
const agent = new rtverseAgent();
const proxy = require("./proxy");

// Socket.io - Web sockets
io.on("connect", (socket) => {
  debug(`Connected ${socket.id}`);
  pipe(agent, socket);
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ extended: true }));

app.use("/", proxy);
function handleFatalError(err) {
  console.error(`${chalk.red("[fatal error]")} ${err.message}`);
  console.error(err.stack);
  process.exit(1);
}

process.on("uncaughtException", handleFatalError);
process.on("unhandledRejection", handleFatalError);

server.listen(port, () => {
  console.log(`${chalk.green("[rtverse-web]")} listening on port ${port}`);
  agent.connect();
});
