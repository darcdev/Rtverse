"use strict";

const debug = require("debug")("rtverse:api:routes");
const express = require("express");
const api = express.Router();
const db = require("rtverse-db");
const { setConfigDB } = require("rtverse-utils");

let services, Agent, Metric;

api.use("*", async (req, res, next) => {
  if (!services) {
    try {
      services = await db(setConfigDB());
    } catch (err) {
      return next(err);
    }
    Agent = services.Agent;
    Metric = services.Metric;
  }
  next();
});

api.get("/agents", async (req, res, next) => {
  let agents = [];
  try {
    agents = await Agent.findConnected();
  } catch (err) {
    return next(err);
  }
  console.log(agents);
  res.status(200).send(agents);
  res.end();
});
api.get("/agent/:uuid", async (req, res, next) => {
  const { uuid } = req.params;
  debug(`request to /agent${uuid}`);
  let agent;
  try {
    agent = await Agent.findByUuid(uuid);
  } catch (error) {
    return next(error);
  }

  if (!agent) {
    return next(new Error(`Agent not found with uuid ${uuid}`));
  }

  res.status(200).send(agent);
});

api.get("/metrics/:uuid", async (req, res, next) => {
  const { uuid } = req.params;

  debug(`request to /metrics/${uuid}`);

  let metrics = [];

  try {
    metrics = await Metric.findByAgentUuid(uuid);
  } catch (err) {
    return next(err);
  }

  if (!metrics || metrics.length === 0) {
    return next(new Error(`Metrics not found for agent with uuid ${uuid}`));
  }
  res.status(200).send(metrics);
});

api.get("/metric/:uuid:/:type", async (req, res) => {
  const { uuid, type } = req.params;

  debug(`request to /metrics/${uuid}/${type}`);

  let metrics = [];

  try {
    metrics = await Metric.findByTypeAgentUuid(type, uuid);
  } catch (error) {
    return next(error);
  }
  if (!metrics || metrics.length === 0) {
    return next(new Error(`Metrics not found for agent with uuid ${uuid}`));
  }
  res.send(metrics);
});

module.exports = api;
