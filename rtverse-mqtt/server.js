"use strict";

const debug = require("debug")("rtverse:mqtt");
const mosca = require("mosca");
const redis = require("redis");
const chalk = require("chalk");
const db = require("rtverse-db");
const { setConfigDB, parsePayload } = require("rtverse-utils");

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
const clients = new Map();

let Agent, Metric;

server.on("clientConnected", (client) => {
  debug(`Client connected : ${client.id}`);
  clients.set(client.id, null);
});

server.on("clientDisconnected", async (client) => {
  debug(`Client disconnected : ${client.id}`);
  const agent = clients.get(client.id);

  if (agent) {
    // Mark Agent as Disconected
    agent.connected = false;
    try {
      await Agent.createOrUpdate(agent);
    } catch (error) {
      return handleError(error);
    }
    // delete from clients list
    clients.delete(client.id);

    server.publish({
      topic: "agent/disconnected",
      payload: JSON.stringify({
        agent: {
          uuid: agent.uuid,
        },
      }),
    });

    debug(
      `Client (${client.id}) associate to Agent (${agent.uuid}) marked as disconnected`
    );
  }
});

server.on("published", async (packet, client) => {
  debug(`Received : ${packet.topic}`);
  switch (packet.topic) {
    case "agent/connected":
    case "agent/disconnected":
      debug(`Payload : ${packet.payload}`);
      break;
    case "agent/message":
      debug(`Payload : ${packet.payload}`);

      const payload = parsePayload(packet.payload);

      if (payload) {
        payload.agent.connected = true;
        let agent;
        try {
          agent = await Agent.createOrUpdate(payload.agent);
        } catch (error) {
          return handleError(e);
        }

        debug(`Agent ${agent.uuid} saved`);

        // Notify Agent is Connected
        if (!clients.get(client.id)) {
          clients.set(client.id, agent);
          server.publish({
            topic: "agent/connected",
            payload: JSON.stringify({
              agent: {
                uuid: agent.uuid,
                name: agent.name,
                hostname: agent.hostname,
                pid: agent.pid,
                connected: agent.connected,
              },
            }),
          });
        }

        // Store Metrics
        for (let metric of payload.metrics) {
          let m;
          try {
            m = await Metric.create(agent.uuid, metric);
          } catch (error) {
            return handleError(error);
          }
          debug(`Metric ${m.id} saved on agent ${agent.uuid}`);
        }
      }
      break;
  }
});

server.on("ready", async () => {
  let config = setConfigDB();
  const services = await db(config).catch(handleFatalError);

  Agent = services.Agent;
  Metric = services.Metric;

  console.log(`${chalk.green("[rtverse-mqtt]")} server is running`);
});

server.on("error", handleFatalError);

function handleFatalError(err) {
  console.error(`${chalk.red("[fatal error]")} ${err.message}}`);
  console.error(err.stack);
  process.exit(1);
}
function handleError() {
  console.error(`${chalk.red("[error]")} ${err.message}}`);
  console.error(err.stack);
}

process.on("uncaughtException", handleFatalError);
process.on("unhandledRejection", handleFatalError);
