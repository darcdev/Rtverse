"use strict";

const debug = require("debug")("rtverse:api:routes");
const express = require("express");
const api = express.Router();

api.get("/agents", (req, res) => {
  res.send({});
});
api.get("/agent/:uuid", (req, res) => {
  const { uuid } = req.params;
  res.send({
    uuid,
  });
});

api.get("/metrics/:uuid", (req, res) => {
  const { uuid } = req.params;
  res.send({
    uuid,
  });
});

api.get("/metric/:uuid:/:type", (req, res) => {
  const { uuid, type } = req.params;
  res.send({ uuid, type });
});

module.exports = api;
