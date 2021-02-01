"use strict";

const debug = require("debug")("rtverse:api:routes");
const express = require("express");
const api = express.Router();
const db = require("rtverse-db");
const { setConfigDB } = require("rtverse-utils");
const auth = require("express-jwt");
const guard = require("express-jwt-permissions")();

const config = require("./config");
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

api.get("/agents", auth(config.auth), async (req, res, next) => {
  const { user } = req;

  if (!user || !user.username) {
    return next(new Error("Not authorized"));
  }

  let agents = [];
  try {
    if (user.admin) {
      agents = await Agent.findAll();
    } else {
      agent = await Agent.findByUsername(user.username);
    }
  } catch (err) {
    return next(err);
  }
  res.status(200).send(agents);
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

api.get(
  "/metrics/:uuid",
  auth(config.auth),
  guard.check(["metrics:read"]),
  async (req, res, next) => {
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
  }
);

api.get("/metrics/:uuid/:type", async (req, res, next) => {
  const { uuid, type } = req.params;

  debug(`request to /metrics/${uuid}/${type}`);

  let metrics = [];

  try {
    metrics = await Metric.findByTypeAgentUuid(type, uuid);
  } catch (error) {
    return next(error);
  }
  if (!metrics || metrics.length === 0) {
    next(new Error(`Metrics not found for agent with uuid ${uuid}`));
  }
  res.status(200).send(metrics);
});

module.exports = api;
